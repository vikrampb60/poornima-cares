const express = require("express");
const router = express.Router();
const Suggestion = require("../models/Suggestion");

// ADD NEW SUGGESTION
router.post("/add", async (req, res) => {
  try {
    const { title, description, userName, userId } = req.body;

    const newSuggestion = new Suggestion({
      title,
      description,
      userName,
      userId,
    });

    await newSuggestion.save();
    res.json({ success: true, message: "Suggestion saved", suggestion: newSuggestion });

  } catch (err) {
    console.error("Suggestion save error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// GET ALL SUGGESTIONS
router.get("/all", async (req, res) => {
  try {
    const list = await Suggestion.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
