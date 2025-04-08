import React, { useState, useEffect } from "react";
import notesStore from "../stores/notesStore";
import useAttachmentStore from "../stores/attachmentStore";
import ShareModal from "./ShareModal";
import { simpleFormatDistanceToNow as formatDistanceToNow } from "./SimpleFallbacks";
import AttachmentList from "./attachment/AttachmentList";

const NoteCard = ({ note }) => {
  const store = notesStore();
  const { attachments, fetchNoteAttachments } = useAttachmentStore();
  const [showShareModal, setShowShareModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Format the date to be more readable
  const formattedDate = note.updatedAt
    ? formatDistanceToNow(new Date(note.updatedAt))
    : "";

  // Fetch attachments when note is loaded, but with error handling
  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        if (note._id) {
          await fetchNoteAttachments(note._id);
        }
      } catch (error) {
        console.error(
          `Error fetching attachments for note ${note._id}:`,
          error
        );
      }
    };

    fetchAttachments();
  }, [note._id, fetchNoteAttachments]);

  // Get attachment count
  const noteAttachments = attachments[note._id] || [];
  const attachmentCount = noteAttachments.length;

  return (
    <div
      className={`note-card ${note.isPinned ? "pinned" : ""} ${
        expanded ? "expanded" : ""
      }`}
    >
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

      <div className="note-content" onClick={() => setExpanded(!expanded)}>
        <p className={`note-body ${expanded ? "expanded" : ""}`}>{note.body}</p>
        {note.body && note.body.length > 100 && !expanded && (
          <button className="btn-expand">Show more</button>
        )}
      </div>

      {/* Show attachment count if there are any */}
      {attachmentCount > 0 && (
        <div className="note-attachment-indicator">
          <span className="attachment-icon">📎</span>
          <span className="attachment-count">
            {attachmentCount}{" "}
            {attachmentCount === 1 ? "attachment" : "attachments"}
          </span>
        </div>
      )}

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

      {/* Render attachments if expanded */}
      {expanded && <AttachmentList noteId={note._id} />}

      {/* Share modal is rendered through Portal */}
      {showShareModal && (
        <ShareModal note={note} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
};

export default NoteCard;
