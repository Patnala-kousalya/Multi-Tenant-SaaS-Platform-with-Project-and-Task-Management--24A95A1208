const { pool } = require("../utils/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * REGISTER TENANT
 */
exports.registerTenant = async (req, res) => {
  const {
    tenantName,
    subdomain,
    adminEmail,
    adminPassword,
    adminFullName,
  } = req.body;

  if (
    !tenantName ||
    !subdomain ||
    !adminEmail ||
    !adminPassword ||
    !adminFullName
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check subdomain uniqueness
    const existingTenant = await client.query(
      "SELECT id FROM tenants WHERE subdomain = $1",
      [subdomain]
    );

    if (existingTenant.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        message: "Subdomain already exists",
      });
    }

    // Create tenant
    const tenantResult = await client.query(
      `
      INSERT INTO tenants 
      (id, name, subdomain, status, subscription_plan, max_users, max_projects)
      VALUES (gen_random_uuid(), $1, $2, 'active', 'free', 5, 3)
      RETURNING id
      `,
      [tenantName, subdomain]
    );

    const tenantId = tenantResult.rows[0].id;

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create tenant admin
    const userResult = await client.query(
      `
      INSERT INTO users 
      (id, tenant_id, email, password_hash, full_name, role)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, 'tenant_admin')
      RETURNING id
      `,
      [tenantId, adminEmail, hashedPassword, adminFullName]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Tenant registered successfully",
      data: {
        tenantId,
        subdomain,
        adminUser: {
          id: userResult.rows[0].id,
          email: adminEmail,
          fullName: adminFullName,
          role: "tenant_admin",
        },
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
};

/**
 * LOGIN
 */
exports.login = async (req, res) => {
  const { email, password, tenantSubdomain } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    // 1. Find user by email first to check role
    const userResult = await pool.query(
      `SELECT id, tenant_id, email, password_hash, full_name, role, is_active FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = userResult.rows[0];

    // 2. Handle super_admin login (no tenant required)
    if (user.role === "super_admin") {
      // Validate password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      // Generate JWT for super_admin
      const token = jwt.sign(
        { userId: user.id, tenantId: null, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            role: user.role,
            tenantId: null,
          },
          token,
        },
      });
    }

    // 3. For other users, tenantSubdomain is required
    if (!tenantSubdomain) {
      return res.status(400).json({
        success: false,
        message: "tenantSubdomain is required for non-admin users",
      });
    }

    // Get tenant and verify it matches user's tenant_id
    const tenantResult = await pool.query(
      "SELECT id, status FROM tenants WHERE subdomain = $1",
      [tenantSubdomain]
    );

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Tenant not found" });
    }

    const tenant = tenantResult.rows[0];

    if (user.tenant_id !== tenant.id) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (tenant.status !== "active") {
      return res.status(403).json({ success: false, message: "Tenant is not active" });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: "Account is inactive" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, tenantId: tenant.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          tenantId: tenant.id,
        },
        token,
      },
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
 * GET CURRENT LOGGED-IN USER
 */
exports.getMe = async (req, res) => {
  try {
    const { userId, tenantId } = req.user;

    const result = await pool.query(
      `
      SELECT id, email, full_name, role, tenant_id
      FROM users
      WHERE id = $1 AND tenant_id = $2
      `,
      [userId, tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
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
