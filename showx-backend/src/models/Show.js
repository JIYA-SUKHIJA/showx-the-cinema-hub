import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: [true, "Movie is required"],
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: [true, "Theatre is required"],
    },
    screen: {
      type: String,
      required: [true, "Screen/Audi name is required"],
    },
    format: {
      type: String,
      required: [true, "Format is required"],
    },
    showDate: {
      type: Date,
      required: [true, "Show date is required"],
    },
    showTime: {
      type: String,
      required: [true, "Show time is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      default: 200,
    },
    totalSeats: {
      type: Number,
      default: 96,
    },
    bookedSeats: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Show = mongoose.model("Show", showSchema);

export default Show;