import notesStore from "../stores/notesStore";
import Note from "./Note";

export default function Notes() {
  const store = notesStore();

  return (
    <div className="notes-container">
      <h2>Notes:</h2>
      <div className="notes-grid">
        {store.notes &&
          store.notes.map((note) => <Note note={note} key={note._id} />)}
      </div>
    </div>
  );
}
