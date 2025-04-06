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

    // Create shared note record
    const sharedNote = await SharedNote.create({
      note: noteId,
      sharedBy: req.user._id,
      sharedWith: shareWithUser._id,
      permissions,
    });

    // Update note with share info
    await Note.findByIdAndUpdate(noteId, {
      $push: { sharedWith: sharedNote._id },
    });

    res.status(200).json({ message: "Note shared successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSharedNotes = async (req, res) => {
  try {
    const sharedNotes = await SharedNote.find({ sharedWith: req.user._id })
      .populate("note")
      .populate("sharedBy", "email");

    res.json({ sharedNotes });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
