import Razorpay from "razorpay";

// This creates one shared Razorpay instance using our test keys,
// so we don't have to re-authenticate every time we make a payment call.
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpayInstance;