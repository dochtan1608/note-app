import React, { useState } from "react";
import notesStore from "../stores/notesStore";

export default function ShareModal({ note, onClose }) {
  const store = notesStore();
  const [email, setEmail] = useState("");
  const [canEdit, setCanEdit] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
    try {
      await store.shareNote(note._id, email, {
        read: true,
        write: canEdit,
      });
      onClose();
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="share-modal">
        <h2>Share Note</h2>
        <form onSubmit={handleShare} className="share-form">
          <div className="form-group">
            <label htmlFor="email">Share with (email):</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              placeholder="Enter email address"
              required
            />
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={canEdit}
                onChange={(e) => setCanEdit(e.target.checked)}
              />
              Allow editing
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-create">
              Share
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
