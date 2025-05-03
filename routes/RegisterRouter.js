const express = require('express');
const router = express.Router();
const {
  createNewUser,
  loginApi,
  forgotPassword,
  resetPassword,
  refreshToken,
} = require("../controller/userContoller");

// Define routes
router.post("/register", createNewUser);
router.post("/login", loginApi);
router.post("/forgotPassword", forgotPassword);
router.get("/reset_password", resetPassword);
router.post("/refresh_token", refreshToken);

module.exports = router;



