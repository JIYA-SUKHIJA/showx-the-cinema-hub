import crypto from "crypto";
import razorpayInstance from "../config/razorpay.js";
import Booking from "../models/Booking.js";

// @route   POST /api/payments/create-order
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to pay for this booking",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "This booking has already been paid for",
      });
    }

    // Razorpay expects amount in paise (smallest currency unit), not rupees.
    const options = {
      amount: booking.totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${booking._id}`,
    };

    const order = await razorpayInstance.orders.create(options);

    booking.razorpayOrderId = order.id;
    await booking.save();

    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error creating payment order",
      error: error.message,
    });
  }
};

// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details",
      });
    }

    // Recreate the signature ourselves using our Key Secret, and compare
    // it to what Razorpay sent. If they match, the payment is genuine.
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isSignatureValid = generatedSignature === razorpay_signature;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (!isSignatureValid) {
      // Signature mismatch means this payment can't be trusted — do NOT
      // confirm the booking. Mark it failed so it's clearly distinguishable
      // from a booking that's still awaiting payment.
      booking.paymentStatus = "failed";
      await booking.save();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed — invalid signature",
      });
    }

    // Only now, after the signature is verified, do we confirm the booking.
    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    booking.razorpayPaymentId = razorpay_payment_id;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error verifying payment",
      error: error.message,
    });
  }
};