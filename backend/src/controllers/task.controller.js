const { pool } = require("../utils/db");

/**
 * CREATE TASK
 */
exports.createTask = async (req, res) => {
  const { projectId } = req.params;
  const { title, description } = req.body;
  const { tenantId } = req.user;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Task title is required",
    });
  }

  try {
    const projectRes = await pool.query(
      "SELECT tenant_id FROM projects WHERE id = $1",
      [projectId]
    );

    if (projectRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (projectRes.rows[0].tenant_id !== tenantId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO tasks (project_id, tenant_id, title, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [projectId, tenantId, title, description || null]
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
 * LIST TASKS
 */
exports.getTasks = async (req, res) => {
  const { projectId } = req.params;
  const { tenantId } = req.user;

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM tasks
      WHERE project_id = $1 AND tenant_id = $2
      ORDER BY created_at DESC
      `,
      [projectId, tenantId]
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
