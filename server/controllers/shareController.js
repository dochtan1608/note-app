const Note = require("../models/note");
const User = require("../models/user");
const SharedNote = require("../models/sharedNote");

exports.shareNote = async (req, res) => {
  try {
    const { noteId, email, permissions } = req.body;

    // Find user to share with
    const shareWithUser = await User.findOne({ email });
    if (!shareWithUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if note is already shared
    const existingShare = await SharedNote.findOne({
      note: noteId,
      sharedWith: shareWithUser._id,
    });

    if (existingShare) {
      return res
        .status(400)
        .json({ error: "Note already shared with this user" });
    }

    // Create shared note record
    const sharedNote = await SharedNote.create({
      note: noteId,
      sharedBy: req.user._id,
      sharedWith: shareWithUser._id,
      permissions,
      status: "pending",
      notified: false,
    });

    // Update note with share info
    await Note.findByIdAndUpdate(noteId, {
      $push: { sharedWith: sharedNote._id },
    });

    res.status(200).json({ message: "Note shared successfully" });
  } catch (err) {
    console.error("Share error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getSharedNotes = async (req, res) => {
  try {
    console.log("Fetching shared notes for user:", req.user._id);

    const sharedNotes = await SharedNote.find({
      sharedWith: req.user._id,
      status: "accepted",
    })
      .populate({
        path: "note",
        populate: {
          path: "attachments",
          model: "Attachment",
        },
      })
      .populate("sharedBy", "email")
      .exec();

    console.log("Found shared notes:", sharedNotes);

    if (!sharedNotes || sharedNotes.length === 0) {
      return res.json({ sharedNotes: [] });
    }

    res.json({ sharedNotes });
  } catch (err) {
    console.error("Get shared notes error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getPendingSharedNotes = async (req, res) => {
  try {
    const pendingShares = await SharedNote.find({
      sharedWith: req.user._id,
      status: "pending",
      notified: false,
    })
      .populate("note", "title body")
      .populate("sharedBy", "email")
      .exec();

    res.json({ pendingShares });
  } catch (err) {
    console.error("Get pending shared notes error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateSharedNoteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== "accepted" && status !== "rejected") {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const sharedNote = await SharedNote.findOne({
      _id: id,
      sharedWith: req.user._id,
      status: "pending",
    });

    if (!sharedNote) {
      return res.status(404).json({ error: "Shared note not found" });
    }

    sharedNote.status = status;
    sharedNote.notified = true;
    await sharedNote.save();

    res.json({ success: true, status });
  } catch (err) {
    console.error("Update shared note status error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.markSharedNoteAsNotified = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await SharedNote.findOneAndUpdate(
      { _id: id, sharedWith: req.user._id },
      { notified: true },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: "Shared note not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Mark shared note as notified error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateSharedNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;

    // Find the shared note and check permissions
    const sharedNote = await SharedNote.findOne({
      note: id,
      sharedWith: req.user._id,
    });

    if (!sharedNote) {
      return res.status(404).json({ error: "Shared note not found" });
    }

    if (!sharedNote.permissions.write) {
      return res.status(403).json({ error: "No permission to edit" });
    }

    // Update the note
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, body },
      { new: true }
    );

    res.json({ note: updatedNote });
  } catch (err) {
    console.error("Update shared note error:", err);
    res.status(500).json({ error: err.message });
  }
};
