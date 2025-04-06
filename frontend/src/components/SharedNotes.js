import React from "react";
import notesStore from "../stores/notesStore";
import SharedNoteCard from "./SharedNoteCard";

export default function SharedNotes() {
  const sharedNotes = notesStore((state) => state.sharedNotes);
  console.log("Shared notes:", sharedNotes);

  return (
    <div className="notes-section">
      <h2>Shared With Me ({sharedNotes?.length || 0})</h2>
      <div className="notes-grid">
        {sharedNotes && sharedNotes.length > 0 ? (
          sharedNotes.map((sharedNote) => (
            <SharedNoteCard key={sharedNote._id} sharedNote={sharedNote} />
          ))
        ) : (
          <p className="no-notes">No shared notes found.</p>
        )}
      </div>
    </div>
  );
}
