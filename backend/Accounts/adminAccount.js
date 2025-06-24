const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // ✅ Add this line
require("dotenv").config();          // ✅ Load SECRET_KEY

const loginAdmin = async (req, res) => {
  try {
    const Admin_Email = "kadminm@gmail.com";
    const Admin_Password = "M743";
    const { email, password } = req.body;

    if (email != Admin_Email) {
      console.log("You are not Admin");
      return res.status(400).json({
        success: false,
        message: `${email} hasn't admin access!`
      });
    } else {
      if (password != Admin_Password) {
        console.log("Password doesn't match");
        return res.status(400).json({
          success: false,
          message: "Invalid Password"
        });
      } else {
        console.log("Logged in successfully!");

        // ✅ Generate token for admin
        const token = jwt.sign(
          { email: Admin_Email, role: "admin" },
          process.env.SECRET_KEY,
          { expiresIn: "7d" }
        );

        return res.status(201).json({
          success: true,
          message: `Admin with the ${email} logged in successfully!`,
          token, // ✅ send token to frontend
          data: {
            email: Admin_Email
          }
        });
      }
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during login, please try again later!"
    });
  }
};

module.exports = loginAdmin;
