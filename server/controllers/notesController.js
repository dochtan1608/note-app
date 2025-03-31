const Note = require("../models/note");

const fetchNotes = async (req, res) => {
  try {
    // find the notes
    const notes = await Note.find({ user: req.user._id });
    //respond with the notes
    res.json({ notes });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
const fetchNote = async (req, res) => {
  try {
    // get id off the url
    const noteId = req.params.id;
    // find the note using that id
    const note = await Note.findOne({ _id: noteId, user: req.user._id });
    // respond with the note
    res.json({ note });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
const createNote = async (req, res) => {
  try {
    //get the sent in data off request body
    const { title, body } = req.body;
    // create a note with it
    const note = await Note.create({
      title,
      body,
      user: req.user._id,
    });
    //respond with the note
    res.json({ note });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
const updateNote = async (req, res) => {
  try {
    // get the id off the url
    const noteId = req.params.id;
    // get the data off the request body
    const { title, body } = req.body;
    // find the update
    await Note.findOneAndUpdate(
      { _id: noteId, user: req.user._id },
      {
        title,
        body,
      }
    );
    //find updated note
    const note = await Note.findById(noteId);
    // respond with it
    res.json({ note });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
const deleteNote = async (req, res) => {
  try {
    //get id off url
    const noteId = req.params.id;
    //delete the record
    await Note.deleteOne({ _id: noteId, user: req.user._id });
    //respond with the deleted note
    res.json({ success: "Note da duoc xoa" });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

module.exports = {
  fetchNotes,
  fetchNote,
  createNote,
  updateNote,
  deleteNote,
};
