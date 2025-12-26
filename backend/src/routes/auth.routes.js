const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Register tenant
router.post(
  "/register-tenant",
  authController.registerTenant
);

// Login
router.post(
  "/login",
  authController.login
);

// Get logged-in user
router.get(
  "/me",
  authMiddleware,
  authController.getMe
);

module.exports = router;
