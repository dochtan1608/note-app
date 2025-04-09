const Note = require("../models/note");

const fetchNotes = async (req, res) => {
  try {
    console.log("Fetching notes for user:", req.user._id);

    // Get all notes
    const notes = await Note.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    console.log("Found notes:", notes);

    res.json({ notes: notes || [] });
  } catch (err) {
    console.error("Error in fetchNotes:", err);
    res.status(500).json({
      error: err.message,
      notes: [],
    });
  }
};

const fetchNote = async (req, res) => {
  // Get id off the url
  const noteId = req.params.id;

  // Find the note using that id
  const note = await Note.findOne({ _id: noteId, user: req.user._id });

  // Respond with the note
  res.json({ note });
};

const createNote = async (req, res) => {
  try {
    // Get data from request body
    const { title, body } = req.body;

    // Create new note with user ID
    const note = await Note.create({
      title,
      body,
      user: req.user._id,
    });

    console.log("Created note:", note);

    // Return the full note object
    res.json({ note });
  } catch (err) {
    console.error("Error in createNote:", err);
    res.status(500).json({ error: err.message });
  }
};

const updateNote = async (req, res) => {
  // Get the id off the url
  const noteId = req.params.id;

  // Get the data off the req body
  const { title, body } = req.body;

  // Find and update the record
  await Note.findOneAndUpdate(
    { _id: noteId, user: req.user._id },
    {
      title,
      body,
    }
  );

  // Find updated note
  const note = await Note.findById(noteId);

  // Respond with it
  res.json({ note });
};

const deleteNote = async (req, res) => {
  // get id off url
  const noteId = req.params.id;

  // Delete the record
  await Note.deleteOne({ _id: noteId, user: req.user._id });

  // Respond
  res.json({ success: "Record deleted" });
};

const togglePin = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    note.isPinned = !note.isPinned;
    await note.save();
    res.json({ note });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    note.isFavorite = !note.isFavorite;
    await note.save();
    res.json({ note });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  fetchNotes,
  fetchNote,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
  toggleFavorite,
};
