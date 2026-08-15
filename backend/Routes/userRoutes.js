const express = require("express");
const router = express.Router();
const { signupUser, loginUser, getProfile } = require("../Controllers/userController.js");
const authenticateToken = require("../Middlewares/auth.js");

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/profile", authenticateToken, getProfile);

module.exports = router;
