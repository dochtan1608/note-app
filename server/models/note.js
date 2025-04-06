const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SharedNote",
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
