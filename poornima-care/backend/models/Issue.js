const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    enrollment: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // 🟨 IMPORTANT: Image URL field added (your frontend uses i.imageUrl)
    imageUrl: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["Pending", "Resolved", "In Progress"],
      default: "Pending",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // you're using createdAt manually
  }
);

module.exports = mongoose.model("Issue", issueSchema);
