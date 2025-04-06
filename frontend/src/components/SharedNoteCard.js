import React, { useState } from "react";
import notesStore from "../stores/notesStore";

export default function SharedNoteCard({ sharedNote }) {
  const store = notesStore();
  const { note, sharedBy, permissions } = sharedNote;
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: note.title,
    body: note.body,
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

  return (
    <div className="note-card">
      <div className="note-card-header">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              value={editForm.title}
              onChange={handleChange}
              className="input-field"
            />
            <textarea
              name="body"
              value={editForm.body}
              onChange={handleChange}
              className="input-field"
            />
            <div className="note-actions">
              <button type="submit" className="btn-update">
                Save
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h3 className="note-title">{note.title}</h3>
            <div className="shared-info">
              <span>Shared by: {sharedBy.email}</span>
              <span className="permissions">
                {permissions.write ? "Can Edit" : "Read Only"}
              </span>
            </div>
            <p className="note-body">{note.body}</p>
            {permissions.write && (
              <div className="note-actions">
                <button
                  className="btn-update"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
