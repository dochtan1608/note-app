import React, { useState } from "react";
import notesStore from "../stores/notesStore";

export default function ShareModal({ note, onClose }) {
  const store = notesStore();
  const [email, setEmail] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [error, setError] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
    setError("");
    setIsSharing(true);

    try {
      await store.shareNote(note._id, email, {
        read: true,
        write: canEdit,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to share note");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="share-modal">
        <h2>Share Note</h2>
        {error && <div className="share-error">{error}</div>}
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
              disabled={isSharing}
            />
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={canEdit}
                onChange={(e) => setCanEdit(e.target.checked)}
                disabled={isSharing}
              />
              Allow editing
            </label>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={isSharing}
            >
              Cancel
            </button>
            <button type="submit" className="btn-create" disabled={isSharing}>
              {isSharing ? "Sharing..." : "Share"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
