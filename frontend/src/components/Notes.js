import React from "react";
import NoteCard from "./NoteCard";
import notesStore from "../stores/notesStore";

export default function Notes() {
  const notes = notesStore((state) => state.notes);
  console.log("Current notes:", notes);

  return (
    <div className="notes-section">
      <h2>My Notes ({notes?.length || 0})</h2>
      <div className="notes-grid">
        {notes && notes.length > 0 ? (
          notes.map((note) => <NoteCard key={note._id} note={note} />)
        ) : (
          <p className="no-notes">No notes found. Create your first note!</p>
        )}
      </div>
    </div>
  );
}
