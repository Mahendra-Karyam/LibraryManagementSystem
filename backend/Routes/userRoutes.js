const express = require("express");
const router = express.Router();
const { signupUser, loginUser, getProfile, forgotPassword } = require("../Controllers/userController.js");
const authenticateToken = require("../Middlewares/auth.js");

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.get("/profile", authenticateToken, getProfile);

module.exports = router;
