import React, { useState } from "react";
import notesStore from "../stores/notesStore";
import ShareModal from "./ShareModal";

export default function NoteCard({ note }) {
  const store = notesStore();
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <div className={`note-card ${note.isPinned ? "pinned" : ""}`}>
      <div className="note-card-header">
        <h3 className="note-title">{note.title}</h3>
        <div className="note-actions-top">
          <button
            onClick={() => store.togglePin(note._id)}
            className={`btn-icon ${note.isPinned ? "active" : ""}`}
            title={note.isPinned ? "Unpin" : "Pin"}
          >
            📌
          </button>
          <button
            onClick={() => store.toggleFavorite(note._id)}
            className={`btn-icon ${note.isFavorite ? "active" : ""}`}
            title={
              note.isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {note.isFavorite ? "⭐" : "☆"}
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="btn-icon"
            title="Share note"
          >
            🔗
          </button>
        </div>
      </div>
      <p className="note-body">{note.body}</p>
      <div className="note-actions">
        <button
          onClick={() => store.deleteNote(note._id)}
          className="btn-delete"
        >
          Delete
        </button>
        <button onClick={() => store.toggleUpdate(note)} className="btn-update">
          Update
        </button>
      </div>

      {showShareModal && (
        <ShareModal note={note} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
}
