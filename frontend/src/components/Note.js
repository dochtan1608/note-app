import notesStore from "../stores/notesStore";

export default function Note({ note }) {
  const store = notesStore();

  return (
    <div className="note-card">
      <h3 className="note-title">{note.title}</h3>
      <p className="note-body">{note.body}</p>
      <div className="btn-group">
        <button
          className="btn btn-delete"
          onClick={() => store.deleteNote(note._id)}
        >
          Delete note
        </button>
        <button className="btn" onClick={() => store.toggleUpdate(note)}>
          Update note
        </button>
      </div>
    </div>
  );
}
