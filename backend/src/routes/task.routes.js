const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const taskController = require("../controllers/task.controller");

router.post(
  "/projects/:projectId/tasks",
  authMiddleware,
  taskController.createTask
);

router.get(
  "/projects/:projectId/tasks",
  authMiddleware,
  taskController.getTasks
);

module.exports = router;
