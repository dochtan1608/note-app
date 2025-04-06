const mongoose = require("mongoose");

const sharedNoteSchema = new mongoose.Schema({
  note: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note",
    required: true,
  },
  sharedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sharedWith: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  permissions: {
    read: { type: Boolean, default: true },
    write: { type: Boolean, default: false },
  },
});

module.exports = mongoose.model("SharedNote", sharedNoteSchema);
