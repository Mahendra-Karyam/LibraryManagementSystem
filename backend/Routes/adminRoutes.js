const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../Controllers/adminController.js");

router.post("/login", loginAdmin);

module.exports = router;
