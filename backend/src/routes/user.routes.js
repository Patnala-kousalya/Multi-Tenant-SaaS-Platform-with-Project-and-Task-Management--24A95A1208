const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

router.post(
  "/tenants/:tenantId/users",
  authMiddleware,
  userController.createUser
);

router.get(
  "/tenants/:tenantId/users",
  authMiddleware,
  userController.getUsers
);

module.exports = router;
