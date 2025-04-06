import React from "react";
import notesStore from "../stores/notesStore";
import SharedNoteCard from "./SharedNoteCard";

export default function SharedNotes() {
  const sharedNotes = notesStore((state) => state.sharedNotes);

  return (
    <div className="shared-notes-container">
      <div className="shared-notes-header">
        <h2>Shared With Me</h2>
        <div className="shared-count">{sharedNotes?.length || 0} notes</div>
      </div>

      {sharedNotes && sharedNotes.length > 0 ? (
        <div className="shared-notes-grid">
          {sharedNotes.map((sharedNote) => (
            <SharedNoteCard key={sharedNote._id} sharedNote={sharedNote} />
          ))}
        </div>
      ) : (
        <div className="empty-shared-notes">
          <div className="empty-icon">📩</div>
          <p>No shared notes found</p>
          <span className="empty-message">
            When someone shares a note with you, it will appear here.
          </span>
        </div>
      )}
    </div>
  );
}
