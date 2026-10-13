const express = require("express");
const router = express.Router();
const Laundry = require("../models/Laundry");

// ✅ ADD or UPDATE
router.post("/add", async (req, res) => {
  try {
    const { bagId, student, status } = req.body;

    if (!bagId) {
      return res.json({ success: false, message: "Bag ID required" });
    }

    let existing = await Laundry.findOne({ bagId });

    if (existing) {
      // 🔥 Update only if provided
      if (status) existing.status = status;
      if (student) existing.student = student;

      await existing.save();

      return res.json({ success: true, message: "Updated" });
    }

    const newLaundry = new Laundry({
      bagId,
      student: student || "Unknown", // ✅ fallback
      status: status || "collected",
    });

    await newLaundry.save();

    res.json({ success: true, message: "Saved" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});


// ✅ GET ALL (ADMIN)
router.get("/all", async (req, res) => {
  try {
    const data = await Laundry.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// ✅ GET BY BAG ID (STUDENT)
router.get("/:bagId", async (req, res) => {
  try {
    const data = await Laundry.findOne({ bagId: req.params.bagId });

    if (!data) return res.json({ success: false });

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;