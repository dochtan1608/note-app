import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import useAttachmentStore from "../../stores/attachmentStore";

const AttachmentUploader = ({
  noteId,
  disabled = false,
  disabledMessage = null,
}) => {
  const { uploadAttachment, isLoading, error, uploadProgress } =
    useAttachmentStore();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection through the input
  const handleFileChange = (e) => {
    if (disabled) return;

    if (e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  // Handle drag-and-drop functionality
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled && !isLoading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled || isLoading) return;

    if (e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  // Upload the file
  const uploadFile = async (file) => {
    if (!noteId) return;
    await uploadAttachment(noteId, file);
  };

  // Click handler for the dropzone
  const handleClick = () => {
    if (!disabled && !isLoading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="attachment-uploader">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={disabled || isLoading}
      />

      <div
        className={`dropzone ${isDragging ? "dragging" : ""} ${
          isLoading ? "uploading" : ""
        } ${disabled ? "disabled" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? "not-allowed" : isLoading ? "wait" : "pointer",
        }}
      >
        {isLoading ? (
          <div className="upload-status">
            <div className="upload-progress">
              <div
                className="progress-bar"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="progress-text">Uploading... {uploadProgress}%</div>
          </div>
        ) : (
          <>
            <div className="upload-icon">📎</div>
            <div className="upload-text">
              {disabled && disabledMessage
                ? disabledMessage
                : "Drag & drop a file or click to browse"}
            </div>
          </>
        )}
      </div>

      {error && (
        <motion.div
          className="attachment-error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p>{error}</p>
        </motion.div>
      )}
    </div>
  );
};

export default AttachmentUploader;
