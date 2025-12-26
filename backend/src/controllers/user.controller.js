const { pool } = require("../utils/db");
const bcrypt = require("bcrypt");

/**
 * CREATE USER (Tenant Admin only)
 */
exports.createUser = async (req, res) => {
  const { tenantId } = req.params;
  const { email, password, fullName, role = "user" } = req.body;

  // RBAC
  if (req.user.role !== "tenant_admin") {
    return res.status(403).json({
      success: false,
      message: "Only tenant admin can create users",
    });
  }

  // Tenant isolation
  if (req.user.tenantId !== tenantId) {
    return res.status(403).json({
      success: false,
      message: "Access denied to this tenant",
    });
  }

  if (!email || !password || !fullName) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    // Check user limit
    const limitResult = await pool.query(
      "SELECT max_users FROM tenants WHERE id = $1",
      [tenantId]
    );

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM users WHERE tenant_id = $1",
      [tenantId]
    );

    if (
      parseInt(countResult.rows[0].count) >=
      limitResult.rows[0].max_users
    ) {
      return res.status(403).json({
        success: false,
        message: "User limit reached for this tenant",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
      RETURNING id, email, full_name, role
      `,
      [tenantId, email, hashedPassword, fullName, role]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * LIST USERS (Tenant Admin only)
 */
exports.getUsers = async (req, res) => {
  const { tenantId } = req.params;

  // RBAC
  if (req.user.role !== "tenant_admin") {
    return res.status(403).json({
      success: false,
      message: "Only tenant admin can view users",
    });
  }

  // Tenant isolation
  if (req.user.tenantId !== tenantId) {
    return res.status(403).json({
      success: false,
      message: "Access denied to this tenant",
    });
  }

  try {
    const result = await pool.query(
      `
      SELECT id, email, full_name, role, is_active, created_at
      FROM users
      WHERE tenant_id = $1
      ORDER BY created_at DESC
      `,
      [tenantId]
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
