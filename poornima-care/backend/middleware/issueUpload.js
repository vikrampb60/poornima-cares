const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upload directory
const issueFolder = path.join(__dirname, "..", "uploads", "issues");

// Create directory if it doesn't exist
if (!fs.existsSync(issueFolder)) {
  fs.mkdirSync(issueFolder, { recursive: true });
  console.log("📂 Created:", issueFolder);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, issueFolder);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Export multer upload instance
module.exports = multer({ storage });
