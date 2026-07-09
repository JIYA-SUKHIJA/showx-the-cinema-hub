import Newsletter from "../models/Newsletter.js";

// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "You're already subscribed!",
      });
    }

    await Newsletter.create({ email });

    res.status(201).json({
      success: true,
      message: "Subscribed successfully — thanks for joining!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error subscribing to newsletter",
      error: error.message,
    });
  }
};