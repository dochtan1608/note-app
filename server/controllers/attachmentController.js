const Attachment = require("../models/attachment");
const Note = require("../models/note");
const fs = require("fs").promises;
const path = require("path");

// Upload a file for a note
exports.uploadAttachment = async (req, res) => {
  try {
    console.log("Upload request received:", req.params);
    console.log("File received:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { noteId } = req.params;

    // Check if note exists and belongs to user
    const note = await Note.findOne({
      _id: noteId,
      user: req.user._id,
    });

    if (!note) {
      // Delete the uploaded file if note doesn't exist
      await fs.unlink(req.file.path);
      return res.status(404).json({ error: "Note not found" });
    }

    // Create attachment record
    const attachment = await Attachment.create({
      filename: req.file.filename,
      originalFilename: req.file.originalname,
      path: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      note: noteId,
      user: req.user._id,
    });

    console.log("Attachment created:", attachment);

    // Add attachment to note
    await Note.findByIdAndUpdate(noteId, {
      $push: { attachments: attachment._id },
    });

    console.log("Note updated with attachment");
    res.status(201).json({ attachment });
  } catch (err) {
    console.error("Error uploading attachment:", err);

    // Clean up file if exists
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkErr) {
        console.error("Error deleting file after failed upload:", unlinkErr);
      }
    }

    res.status(500).json({ error: "Failed to upload attachment" });
  }
};

// Get all attachments for a note
exports.getNoteAttachments = async (req, res) => {
  try {
    const { noteId } = req.params;
    console.log("Fetching attachments for note:", noteId);

    // Verify note belongs to user
    const note = await Note.findOne({
      _id: noteId,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    const attachments = await Attachment.find({ note: noteId });
    console.log(`Found ${attachments.length} attachments for note ${noteId}`);

    res.json({ attachments });
  } catch (err) {
    console.error("Error fetching attachments:", err);
    res.status(500).json({ error: "Failed to fetch attachments" });
  }
};

// Download an attachment
exports.downloadAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Download request for attachment:", id);

    const attachment = await Attachment.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!attachment) {
      return res.status(404).json({ error: "Attachment not found" });
    }

    // Verify file exists
    try {
      await fs.access(attachment.path);
    } catch (error) {
      console.error("File not found on disk:", error);
      return res.status(404).json({ error: "File not found on server" });
    }

    console.log("Sending file:", attachment.path);
    res.download(attachment.path, attachment.originalFilename, (err) => {
      if (err) {
        console.error("Download error:", err);
        // If headers already sent, we can't send an error response
        if (!res.headersSent) {
          res.status(500).json({ error: "Failed to download file" });
        }
      }
    });
  } catch (err) {
    console.error("Error downloading attachment:", err);
    res.status(500).json({ error: "Failed to download attachment" });
  }
};

// Delete an attachment
exports.deleteAttachment = async (req, res) => {
  try {
    const { id } = req.params;

    const attachment = await Attachment.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!attachment) {
      return res.status(404).json({ error: "Attachment not found" });
    }

    // Remove attachment from note
    await Note.findByIdAndUpdate(attachment.note, {
      $pull: { attachments: attachment._id },
    });

    // Delete file from storage
    try {
      await fs.unlink(attachment.path);
    } catch (unlinkErr) {
      console.error("Error deleting file:", unlinkErr);
      // Continue with deletion even if file removal fails
    }

    // Delete attachment record
    await Attachment.deleteOne({ _id: id });

    res.json({ message: "Attachment deleted successfully" });
  } catch (err) {
    console.error("Error deleting attachment:", err);
    res.status(500).json({ error: "Failed to delete attachment" });
  }
};
