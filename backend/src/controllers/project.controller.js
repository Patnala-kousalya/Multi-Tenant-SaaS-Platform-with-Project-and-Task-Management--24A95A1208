const { pool } = require("../utils/db");

/**
 * CREATE PROJECT
 */
exports.createProject = async (req, res) => {
  const { name, description } = req.body;
  const { tenantId, userId } = req.user;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Project name is required",
    });
  }

  try {
    const tenantRes = await pool.query(
      "SELECT max_projects FROM tenants WHERE id = $1",
      [tenantId]
    );

    const countRes = await pool.query(
      "SELECT COUNT(*) FROM projects WHERE tenant_id = $1",
      [tenantId]
    );

    if (parseInt(countRes.rows[0].count) >= tenantRes.rows[0].max_projects) {
      return res.status(403).json({
        success: false,
        message: "Project limit reached",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO projects (tenant_id, name, description, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [tenantId, name, description || null, userId]
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
 * LIST PROJECTS
 */
exports.getProjects = async (req, res) => {
  const { tenantId } = req.user;

  try {
    const result = await pool.query(
      `
      SELECT p.*, u.full_name AS created_by_name
      FROM projects p
      JOIN users u ON p.created_by = u.id
      WHERE p.tenant_id = $1
      ORDER BY p.created_at DESC
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
