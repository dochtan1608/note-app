import React, { useState } from "react";
import notesStore from "../stores/notesStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  simpleFormatDistanceToNow as formatDistanceToNow,
  simpleFormat as format,
} from "./SimpleFallbacks";
import SharedNoteAttachments from "./attachment/SharedNoteAttachments";

const SharedNoteCard = ({ sharedNote }) => {
  const store = notesStore();
  const { note, sharedBy, permissions } = sharedNote;
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({
    title: note?.title || "",
    body: note?.body || "",
  });
  const [showAttachments, setShowAttachments] = useState(false);

  if (!note) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await store.updateSharedNote(note._id, editForm);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update note:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Format dates
  const timeAgo = note.updatedAt
    ? formatDistanceToNow(new Date(note.updatedAt))
    : "";

  const formattedDate = note.updatedAt
    ? format(new Date(note.updatedAt), "MMM d, yyyy 'at' h:mm a")
    : "";

  // check if note has attachments
  const hasAttachments = note.attachments && note.attachments.length > 0;

  return (
    <div className={`shared-note-card ${isEditing ? "is-editing" : ""}`}>
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="shared-note-edit-container"
          >
            <form onSubmit={handleSubmit} className="edit-shared-form">
              <div className="form-header">
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Edit Shared Note
                </motion.h3>
                <motion.button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsEditing(false)}
                  title="Cancel editing"
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>

              <motion.div
                className="edit-form-fields"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <div className="form-group">
                  <label htmlFor="edit-title">Title</label>
                  <motion.input
                    id="edit-title"
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleChange}
                    className="input-field edit-title"
                    placeholder="Note Title"
                    whileFocus={{
                      scale: 1.01,
                      boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.1)",
                    }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-body">Content</label>
                  <motion.textarea
                    id="edit-body"
                    name="body"
                    value={editForm.body}
                    onChange={handleChange}
                    className="input-field edit-body"
                    placeholder="Note Content"
                    rows="6"
                    whileFocus={{
                      scale: 1.01,
                      boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.1)",
                    }}
                  />
                </div>
              </motion.div>

              <motion.div
                className="form-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-cancel-modal"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  className="btn-update-submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="view-note"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="shared-note-header">
              <div className="shared-info">
                <div className="shared-by">
                  <span className="shared-by-name">{sharedBy.email}</span>
                </div>
                <div
                  className={`permission-badge ${
                    permissions.write ? "can-edit" : "read-only"
                  }`}
                >
                  {permissions.write ? "✏️ Can Edit" : "🔒 Read Only"}
                </div>
              </div>
              <div className="shared-date" title={formattedDate}>
                {timeAgo}
              </div>
            </div>

            <div className="shared-note-content">
              <h3 className="shared-note-title">{note.title}</h3>
              <p className="shared-note-body">{note.body}</p>
              {hasAttachments && (
                <div className="note-attachment-indicator">
                  <span className="attachment-icon">📎</span>
                  <span className="attachment-count">
                    {note.attachments.length}{" "}
                    {note.attachments.length === 1
                      ? "attachment"
                      : "attachments"}
                  </span>
                  <button
                    className="btn-toggle-shared-attachments"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAttachments(!showAttachments);
                    }}
                  >
                    {showAttachments ? "Hide" : "Show"}
                  </button>
                </div>
              )}
              {showAttachments && hasAttachments && (
                <SharedNoteAttachments attachments={note.attachments} />
              )}
            </div>

            <div className="shared-note-footer">
              {permissions.write && (
                <motion.button
                  className="btn-edit-shared"
                  onClick={() => setIsEditing(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-icon-text">✏️ Edit Note</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SharedNoteCard;
