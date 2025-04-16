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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const formattedDate = note.updatedAt
    ? formatDistanceToNow(new Date(note.updatedAt))
    : "";
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
  const noteAttachments = attachments[note._id] || [];
  const attachmentCount = noteAttachments.length;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    try {
      // Show success animation before actually deleting
      setDeleteSuccess(true);

      // Wait a moment to show the success animation
      setTimeout(async () => {
        await store.deleteNote(note._id);
        setIsDeleting(false);
        setShowDeleteConfirm(false);
      }, 1500);
    } catch (error) {
      console.error("Error deleting note:", error);
      setIsDeleting(false);
      setDeleteSuccess(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div
      className={`note-card ${note.isPinned ? "pinned" : ""} ${
        expanded ? "expanded" : ""
      } ${deleteSuccess ? "deleting" : ""}`}
    >
      <div className="note-top-content">
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
          <p
            className={`note-body ${expanded ? "expanded" : ""}`}
            style={{ whiteSpace: "pre-wrap" }}
          >
            {note.body}
          </p>
          {note.body && note.body.length > 100 && !expanded && (
            <button className="btn-expand">Show more</button>
          )}
        </div>

        {attachmentCount > 0 && (
          <div className="note-attachment-indicator">
            <span className="attachment-icon">📎</span>
            <span className="attachment-count">
              {attachmentCount}{" "}
              {attachmentCount === 1 ? "attachment" : "attachments"}
            </span>
          </div>
        )}

        {expanded && <AttachmentList noteId={note._id} />}
      </div>

      <div className="note-bottom-content">
        <div className="note-metadata">
          <span className="note-date">{formattedDate}</span>
        </div>

        <div className="note-actions">
          {showDeleteConfirm ? (
            <div className="delete-confirmation">
              {deleteSuccess ? (
                <div className="delete-success">
                  <div className="success-checkmark">
                    <svg
                      className="checkmark"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 52 52"
                    >
                      <circle
                        className="checkmark__circle"
                        cx="26"
                        cy="26"
                        r="25"
                        fill="none"
                      />
                      <path
                        className="checkmark__check"
                        fill="none"
                        d="M14.1 27.2l7.1 7.2 16.7-16.8"
                      />
                    </svg>
                  </div>
                  <p>Successfully deleted!</p>
                </div>
              ) : (
                <>
                  <p>Do you want to delete this note?</p>
                  <div className="confirm-actions">
                    <button
                      onClick={handleCancelDelete}
                      className="btn-cancel-delete"
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="btn-confirm-delete"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Yes"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <button onClick={handleDeleteClick} className="btn-delete">
                Delete
              </button>
              <button
                onClick={() => store.toggleUpdate(note)}
                className="btn-update"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>

      {showShareModal && (
        <ShareModal note={note} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
};

export default NoteCard;
