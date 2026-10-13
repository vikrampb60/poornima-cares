const mongoose = require("mongoose");

const laundrySchema = new mongoose.Schema(
  {
    bagId: {
      type: String,
      required: true,
      unique: true,
    },

    // ✅ FIXED HERE
    student: {
      type: String,
      default: "Unknown",
    },

    status: {
      type: String,
      enum: ["collected", "washing", "ironing", "ready"],
      default: "collected",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Laundry", laundrySchema);