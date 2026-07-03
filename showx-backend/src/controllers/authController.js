import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Helper function: sends the JWT as an HTTP-only cookie.
// HTTP-only means JavaScript in the browser CANNOT read this cookie —
// it's only sent automatically with requests, protecting against XSS attacks.
const sendTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true, // JS can't access this cookie
    secure: process.env.NODE_ENV === "production", // only sent over HTTPS in production
    sameSite: "strict", // cookie only sent for same-site requests (CSRF protection)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation: make sure all fields were sent
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // Check if a user with this email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create the user. The password hashing happens AUTOMATICALLY
    // because of the pre("save") hook we wrote in User.js — we never
    // have to manually hash it here.
    const user = await User.create({ name, email, password });

    // Generate a JWT for this new user so they're logged in immediately after registering
    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    // Respond with user info (no password, since schema has select:false)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
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

    // We need .select("+password") because our schema hides password by default (select: false).
    // Here we explicitly ask for it since we need to compare it.
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Use the instance method we defined in User.js to compare passwords
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
  // Overwrite the cookie with an empty value and immediate expiry,
  // which effectively deletes it from the browser.
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// @route   GET /api/auth/profile
// @access  Private (requires the 'protect' middleware)
export const getProfile = async (req, res) => {
  // req.user was already attached by our authMiddleware.js after verifying the JWT
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

    // Only update fields that were actually sent in the request body.
    // This allows partial updates (e.g. updating just the name).
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // If a new password was sent, this triggers our pre("save") hook
    // in User.js to hash it automatically.
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