const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  console.log("Creating uploads directory at:", uploadDir);
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with original extension
    const uniqueSuffix = crypto.randomBytes(16).toString("hex");
    const fileExt = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExt);
  },
});

// File filter to restrict file types if needed
const fileFilter = (req, file, cb) => {
  // Accept all file types for now
  // You can add restrictions here if needed
  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB size limit
  },
  fileFilter: fileFilter,
});

module.exports = upload;
