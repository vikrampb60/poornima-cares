const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const issueRoutes = require("./routes/issueRoutes");
const suggestionRoutes = require("./routes/suggestionRoutes");
const laundryRoutes = require("./routes/laundryRoutes"); // ✅ NEW

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/issues", express.static(path.join(__dirname, "uploads/issues")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// API Routes
app.use("/api/issues", issueRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/laundry", laundryRoutes); // ✅ NEW

// Root Route
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);