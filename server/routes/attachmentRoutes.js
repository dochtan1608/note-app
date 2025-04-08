const express = require("express");
const router = express.Router();
const attachmentController = require("../controllers/attachmentController");
const requireAuth = require("../middleware/requireAuth");
const upload = require("../middleware/uploadMiddleware");

// Apply authentication middleware to all routes
router.use(requireAuth);

// Upload a file to a note
router.post(
  "/:noteId",
  upload.single("file"),
  attachmentController.uploadAttachment
);

// Get all attachments for a note
router.get("/note/:noteId", attachmentController.getNoteAttachments);

// Download an attachment
router.get("/:id/download", attachmentController.downloadAttachment);

// Delete an attachment
router.delete("/:id", attachmentController.deleteAttachment);

module.exports = router;
