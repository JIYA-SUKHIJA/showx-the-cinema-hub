import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library";

// In production (Render/Vercel), frontend and backend are on different
// domains over HTTPS, so we need secure:true + sameSite:"none" for the
// cookie to be sent cross-site. But on localhost, we're on plain HTTP —
// browsers refuse to set a "secure" cookie over HTTP, so login would
// silently fail to persist. This checks NODE_ENV and picks the right
// settings automatically for whichever environment we're running in.
const isProduction = process.env.NODE_ENV === "production";

// This client knows how to talk to Google's servers to verify tokens.
// We give it our Client ID so it knows which app's tokens to trust.
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sendTokenCookie = (res, token, rememberMe) => {
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };

  // If "Remember Me" is checked, the cookie survives for 30 days —
  // the browser stores it on disk and sends it even after being closed/reopened.
  // If NOT checked, we skip maxAge entirely, which makes it a "session cookie" —
  // the browser deletes it automatically the moment the browser is fully closed.
  if (rememberMe) {
    cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  }

  res.cookie("token", token, cookieOptions);
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
    const { email, password, rememberMe } = req.body;

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
    sendTokenCookie(res, token, rememberMe);

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

// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res) => {
  try {
    // The frontend sends us a "credential" — a signed token from Google
    // that proves who the user is. We never trust this blindly; we ask
    // Google's own servers to verify it's real and wasn't tampered with.
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // "payload" is the verified, trustworthy info Google gives us back —
    // the user's name, email, profile picture, and a unique Google ID.
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // First, check if this Google account was already used to log in before.
    let user = await User.findOne({ googleId });

    if (!user) {
      // Not found by googleId — maybe they signed up normally with this
      // same email earlier. If so, link the Google account to that
      // existing user instead of creating a duplicate.
      user = await User.findOne({ email });

      if (user) {
        user.googleId = googleId;
        if (!user.avatar) user.avatar = picture;
        await user.save({ validateBeforeSave: false });
      } else {
        // Brand new user — create an account with no password at all.
        user = await User.create({
          name,
          email,
          googleId,
          avatar: picture,
        });
      }
    }

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Google login successful",
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
      message: "Google authentication failed",
      error: error.message,
    });
  }
};

// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
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

// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email is registered, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2>Hello ${user.name},</h2>
        <p>You requested a password reset for your ShowX CinemaHub account.</p>
        <p>Click the button below to reset your password. This link will expire in 10 minutes.</p>
        <a href="${resetUrl}" style="display:inline-block; padding:12px 24px; background:#e50914; color:#fff; text-decoration:none; border-radius:6px; margin:16px 0;">
          Reset Password
        </a>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>— ShowX CinemaHub Team</p>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "ShowX CinemaHub — Password Reset Request",
        html,
      });

      res.status(200).json({
        success: true,
        message: "If that email is registered, a reset link has been sent.",
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Email could not be sent. Please try again later.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during forgot password",
      error: error.message,
    });
  }
};

// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please provide a new password",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpire");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or has expired",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during password reset",
      error: error.message,
    });
  }
};