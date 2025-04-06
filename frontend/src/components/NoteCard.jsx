import React, { useState } from "react";
import notesStore from "../stores/notesStore";
import ShareModal from "./ShareModal";
import { simpleFormatDistanceToNow as formatDistanceToNow } from "./SimpleFallbacks";

const NoteCard = ({ note }) => {
  const store = notesStore();
  const [showShareModal, setShowShareModal] = useState(false);

  // Format the date to be more readable
  const formattedDate = note.updatedAt
    ? formatDistanceToNow(new Date(note.updatedAt))
    : "";

  return (
    <div className={`note-card ${note.isPinned ? "pinned" : ""}`}>
      <div className="note-card-header">
        <h3 className="note-title">{note.title}</h3>
        <div className="note-actions-top">
          {/* Restore the pin button */}
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

      <div className="note-metadata">
        <span className="note-date">{formattedDate}</span>
      </div>

      <div className="note-actions">
        <button
          onClick={() => store.deleteNote(note._id)}
          className="btn-delete"
        >
          Delete
        </button>
        <button onClick={() => store.toggleUpdate(note)} className="btn-update">
          Edit
        </button>
      </div>

      {showShareModal && (
        <ShareModal note={note} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
};

export default NoteCard;
