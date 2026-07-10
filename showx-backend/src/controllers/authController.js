import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const sendTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.phone !== undefined) {
      user.phone = req.body.phone;
    }

    if (req.body.avatar !== undefined) {
      user.avatar = req.body.avatar;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating profile",
      error: error.message,
    });
  }
};