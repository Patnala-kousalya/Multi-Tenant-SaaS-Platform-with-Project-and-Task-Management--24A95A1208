const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const projectController = require("../controllers/project.controller");

router.post("/", authMiddleware, projectController.createProject);
router.get("/", authMiddleware, projectController.getProjects);

module.exports = router;
