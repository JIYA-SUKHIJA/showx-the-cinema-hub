import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // Who this notification is for. If "forAdmin" is true, it's shown to
    // every admin regardless of the "user" field below.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    forAdmin: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["booking", "payment", "system"],
      default: "booking",
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
    },
    // Optional link to the related booking, so the UI can navigate to it.
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;