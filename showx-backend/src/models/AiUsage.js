// src/models/AiUsage.js
import mongoose from "mongoose";

const aiUsageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    // stored as YYYY-MM-DD string so each day gets its own document
    type: String,
    required: true,
  },
  queriesUsed: {
    type: Number,
    default: 0,
  },
  lastQueryTime: {
    type: Date,
    default: Date.now,
  },
});

// One usage document per user per day
aiUsageSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("AiUsage", aiUsageSchema);