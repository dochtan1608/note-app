import React, { useState, useEffect } from "react";
import notesStore from "../stores/notesStore";
import AttachmentUploader from "./attachment/AttachmentUploader";
import AttachmentList from "./attachment/AttachmentList";
import useAttachmentStore from "../stores/attachmentStore";

const CreateForm = () => {
  const store = notesStore();
  const { clearNoteAttachments } = useAttachmentStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempNoteId, setTempNoteId] = useState(`temp-${Date.now()}`);
  const [showAttachmentUploader, setShowAttachmentUploader] = useState(true);
  const [pendingAttachments, setPendingAttachments] = useState([]);

  // Clear previous attachments when form is reset
  useEffect(() => {
    return () => {
      if (!store.updateForm._id) {
        clearNoteAttachments(tempNoteId);
      }
    };
  }, [tempNoteId, store.updateForm._id, clearNoteAttachments]);

  // Don't render if update form is active - moved after hooks
  if (store.updateForm._id) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only proceed if there's actual content
    if (!store.createForm.title.trim() && !store.createForm.body.trim()) return;

    setIsSubmitting(true);
    try {
      // Include pending attachments in the note creation payload
      const result = await store.createNote(e, pendingAttachments);

      if (result && result.note && result.note._id) {
        // Reset temp ID and attachments after successful creation
        setTempNoteId(`temp-${Date.now()}`);
        setPendingAttachments([]);
      }
    } catch (err) {
      console.error("Error creating note:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle attachment upload
  const handleAttachmentUpload = (file) => {
    // Store attachment in state to be sent with note creation
    setPendingAttachments((prev) => [...prev, file]);
  };

  // Handle attachment removal
  const handleAttachmentRemove = (index) => {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="create-form-section">
      <h2>Create Note</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={store.createForm.title}
          onChange={store.updateCreateFormField}
          className="input-field"
          placeholder="Title"
          required
        />

        <textarea
          name="body"
          value={store.createForm.body}
          onChange={store.updateCreateFormField}
          className="input-field"
          placeholder="What's on your mind?"
          required
          rows="5"
        />

        {/* Always show the attachment section */}
        <div className="attachments-container">
          <h4 className="attachments-title">Attachments</h4>

          {/* Show attachment uploader - now enabled even without a real note ID */}
          {showAttachmentUploader && (
            <div className="temp-attachment-uploader">
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleAttachmentUpload(e.target.files[0]);
                  }
                }}
                className="file-input"
              />

              <div className="dropzone">
                <div className="upload-icon">📎</div>
                <div className="upload-text">
                  Drag & drop files here or click to browse
                </div>
              </div>
            </div>
          )}

          {/* Show pending attachments */}
          {pendingAttachments.length > 0 && (
            <div className="pending-attachments">
              <h5>Files to attach ({pendingAttachments.length})</h5>
              <div className="attachments-grid">
                {pendingAttachments.map((file, index) => (
                  <div className="attachment-item" key={index}>
                    <div className="attachment-link">
                      <div className="attachment-icon">📎</div>
                      <div className="attachment-details">
                        <div className="attachment-name">{file.name}</div>
                        <div className="attachment-meta">
                          {(file.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                      <button
                        onClick={() => handleAttachmentRemove(index)}
                        className="attachment-delete"
                        title="Remove file"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="btn-create" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Creating...
            </>
          ) : (
            "Create Note"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateForm;
