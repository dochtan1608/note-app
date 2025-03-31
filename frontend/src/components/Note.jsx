import notesStore from "../stores/notesStore";

export default function Note({ note }) {
  const store = notesStore((store) => {
    return { deleteNote: store.deleteNote, toggleUpdate: store.toggleUpdate };
  });

  return (
    <div className="note">
      <h3>{note.title}</h3>
      <p style={{ whiteSpace: "pre-wrap" }}>{note.body}</p>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => store.deleteNote(note._id)}>Delete</button>
        <button onClick={() => store.toggleUpdate(note)}>Update</button>
      </div>
    </div>
  );
}
