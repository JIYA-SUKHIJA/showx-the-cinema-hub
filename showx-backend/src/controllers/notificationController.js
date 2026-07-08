import Notification from "../models/Notification.js";

// @route   GET /api/notifications/admin
// @desc    All notifications meant for admins (newest first)
// @access  Private/Admin
export const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ forAdmin: true })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      forAdmin: true,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching admin notifications",
      error: error.message,
    });
  }
};

// @route   GET /api/notifications/my
// @desc    Notifications for the logged-in user (newest first)
// @access  Private
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching notifications",
      error: error.message,
    });
  }
};

// @route   PUT /api/notifications/:id/read
// @desc    Mark a single notification as read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating notification",
      error: error.message,
    });
  }
};

// @route   PUT /api/notifications/read-all
// @desc    Mark all of the caller's notifications as read
//          (admin notifications if caller is admin, else their own)
// @access  Private
export const markAllAsRead = async (req, res) => {
  try {
    const filter = req.user.role === "admin"
      ? { forAdmin: true }
      : { user: req.user._id };

    await Notification.updateMany(filter, { isRead: true });

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating notifications",
      error: error.message,
    });
  }
};

// Not a route handler — a reusable helper other controllers (like
// bookingController / paymentController) call directly to create
// notifications when something happens (e.g. a new paid booking).
export const createNotification = async ({
  user = null,
  forAdmin = false,
  type = "booking",
  title,
  message,
  booking = null,
}) => {
  try {
    await Notification.create({ user, forAdmin, type, title, message, booking });
  } catch (error) {
    // Notification failures should never break the main booking/payment flow.
    console.error("Failed to create notification:", error.message);
  }
};