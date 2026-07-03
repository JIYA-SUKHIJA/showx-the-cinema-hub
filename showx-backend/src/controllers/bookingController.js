import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { showId, seats } = req.body;

    if (!showId || !seats || seats.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Show ID and at least one seat are required",
      });
    }

    const show = await Show.findById(showId).session(session);

    if (!show) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    const alreadyBooked = seats.filter((seat) =>
      show.bookedSeats.includes(seat)
    );

    if (alreadyBooked.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Seats already booked: ${alreadyBooked.join(", ")}`,
      });
    }

    const totalAmount = seats.length * show.price;

    const booking = await Booking.create(
      [
        {
          user: req.user._id,
          show: showId,
          seats,
          totalAmount,
        },
      ],
      { session }
    );

    show.bookedSeats.push(...seats);
    await show.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully",
      booking: booking[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: "Server error creating booking",
      error: error.message,
    });
  }
};

export const cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(req.params.id).session(session);

    if (!booking) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking",
      });
    }

    if (booking.status === "cancelled") {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    booking.status = "cancelled";
    await booking.save({ session });

    const show = await Show.findById(booking.show).session(session);
    if (show) {
      show.bookedSeats = show.bookedSeats.filter(
        (seat) => !booking.seats.includes(seat)
      );
      await show.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: "Server error cancelling booking",
      error: error.message,
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: "show",
        populate: [
          { path: "movie", select: "title poster" },
          { path: "theatre", select: "name location" },
        ],
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

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "show",
      populate: [
        { path: "movie", select: "title poster" },
        { path: "theatre", select: "name location" },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this booking",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching booking",
      error: error.message,
    });
  }
};