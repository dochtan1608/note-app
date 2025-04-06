import React, { useState } from "react";
import notesStore from "../stores/notesStore";

export default function SharedNoteCard({ sharedNote }) {
  const store = notesStore();
  const { note, sharedBy, permissions } = sharedNote;
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: note?.title || "",
    body: note?.body || "",
  });

  if (!note) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await store.updateSharedNote(note._id, editForm);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update note:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={`shared-note-card ${isEditing ? "is-editing" : ""}`}>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="edit-shared-form">
          <div className="form-header">
            <h3>Edit Note</h3>
            <button
              type="button"
              className="btn-icon close-edit"
              onClick={() => setIsEditing(false)}
              title="Cancel editing"
            >
              ✕
            </button>
          </div>
          <input
            type="text"
            name="title"
            value={editForm.title}
            onChange={handleChange}
            className="input-field edit-title"
            placeholder="Note Title"
          />
          <textarea
            name="body"
            value={editForm.body}
            onChange={handleChange}
            className="input-field edit-body"
            placeholder="Note Content"
            rows="6"
          />
          <div className="form-footer">
            <button type="submit" className="btn-update-submit">
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="shared-note-header">
            <div className="shared-info">
              <div className="shared-by">
                <span className="shared-by-icon">👤</span>
                <span className="shared-by-name">{sharedBy.email}</span>
              </div>
              <div
                className={`permission-badge ${
                  permissions.write ? "can-edit" : "read-only"
                }`}
              >
                {permissions.write ? "✏️ Can Edit" : "👁️ Read Only"}
              </div>
            </div>
            <div className="shared-date">
              {note.updatedAt && formatDate(note.updatedAt)}
            </div>
          </div>

          <div className="shared-note-content">
            <h3 className="shared-note-title">{note.title}</h3>
            <p className="shared-note-body">{note.body}</p>
          </div>

          <div className="shared-note-footer">
            {permissions.write && (
              <button
                className="btn-edit-shared"
                onClick={() => setIsEditing(true)}
              >
                <span className="btn-icon-text">✏️ Edit Note</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
