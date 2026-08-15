const { User } = require("../Databases/userDatabase.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// POST /api/user/signup
const signupUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const existingUserWith_email = await User.findOne({ email });
    if (existingUserWith_email) {
      return res.status(400).json({
        success: false,
        message: `User already exists with the email ${email}. Please try again with a different email.`,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: `User with the ${email} registered successfully!`,
      data: {
        name: newUser.userName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during registration, please try again later!",
    });
  }
};

// POST /api/user/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUserWith_email = await User.findOne({ email });
    if (!existingUserWith_email) {
      return res.status(400).json({
        success: false,
        message: `User with the email ${email} was not signed up. Please sign up first!`,
      });
    }

    const comparePassword = await bcrypt.compare(password, existingUserWith_email.password);
    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { userName: existingUserWith_email.userName, email: existingUserWith_email.email },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      message: `User with the ${email} logged in successfully!`,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during login, please try again later!",
    });
  }
};

// GET /api/user/profile (protected)
const getProfile = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected profile data",
    user: req.user, // populated by the authenticateToken middleware
  });
};

module.exports = { signupUser, loginUser, getProfile };
