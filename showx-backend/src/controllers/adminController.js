import User from "../models/User.js";
import Movie from "../models/Movie.js";
import Booking from "../models/Booking.js";

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Admin only
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const paidBookings = await Booking.find({ paymentStatus: "paid" });
    const totalRevenue = paidBookings.reduce(
      (sum, booking) => sum + booking.totalAmount,
      0
    );

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalMovies,
        totalBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching dashboard stats",
      error: error.message,
    });
  }
};

// @desc    Get last 7 days booking trend
// @route   GET /api/admin/weekly-trend
// @access  Admin only
export const getWeeklyTrend = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const bookings = await Booking.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
      const found = bookings.find((b) => b._id === dateStr);
      result.push({ name: dayLabel, traffic: found ? found.count : 0 });
    }

    res.status(200).json({
      success: true,
      trend: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching weekly trend",
      error: error.message,
    });
  }
};

// @desc    Get all bookings (of every user)
// @route   GET /api/admin/bookings
// @access  Admin only
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate({
        path: "show",
        populate: { path: "movie", select: "title" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching bookings",
      error: error.message,
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin only
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching users",
      error: error.message,
    });
  }
};

// @desc    Update a user's role
// @route   PUT /api/admin/users/:id/role
// @access  Admin only
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'user' or 'admin'",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating user role",
      error: error.message,
    });
  }
};