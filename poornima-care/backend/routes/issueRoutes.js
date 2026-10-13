const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue");
const multer = require("multer");
const path = require("path");

// -----------------------------------------
// Multer Storage (Uploads → /uploads/issues)
// -----------------------------------------
const issueFolder = path.join(__dirname, "..", "uploads", "issues");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, issueFolder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// -----------------------------------------
// Add New Issue
// -----------------------------------------
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { studentName, enrollment, category, message, title } = req.body;

    const newIssue = new Issue({
      studentName,
      enrollment,
      category,
      title,
      message,
      status: "Pending",
      imageUrl: req.file ? `/uploads/issues/${req.file.filename}` : null,
      createdAt: new Date(),
    });

    await newIssue.save();

    res.json({
      success: true,
      message: "Issue submitted successfully",
      issue: newIssue,
    });

  } catch (err) {
    console.error("❌ Issue Save Error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// -----------------------------------------
// Get All Issues
// -----------------------------------------
router.get("/all", async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// -----------------------------------------
// Get Only Resolved Issues
// -----------------------------------------
router.get("/resolved", async (req, res) => {
  try {
    const resolved = await Issue.find({ status: "Resolved" }).sort({ createdAt: -1 });
    res.json(resolved);
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// -----------------------------------------
// Update Status (Pending → Resolved)
// -----------------------------------------
router.put("/update-status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
