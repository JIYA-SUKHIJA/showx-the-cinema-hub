import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "City name is required"],
      unique: true,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

const City = mongoose.model("City", citySchema);

export default City;