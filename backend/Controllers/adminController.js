const jwt = require("jsonwebtoken");

// POST /api/admin/login
// Admin credentials are fixed (no separate admin collection) and now read
// from .env (ADMIN_EMAIL / ADMIN_PASSWORD) instead of being hardcoded here.
const loginAdmin = async (req, res) => {
  try {
    const Admin_Email = process.env.ADMIN_EMAIL;
    const Admin_Password = process.env.ADMIN_PASSWORD;
    const { email, password } = req.body;

    if (email !== Admin_Email) {
      return res.status(400).json({
        success: false,
        message: `${email} hasn't admin access!`,
      });
    }

    if (password !== Admin_Password) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { email: Admin_Email, role: "admin" },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: `Admin with the ${email} logged in successfully!`,
      token,
      data: { email: Admin_Email },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during login, please try again later!",
    });
  }
};

module.exports = { loginAdmin };