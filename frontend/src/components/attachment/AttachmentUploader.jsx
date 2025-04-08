import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import useAttachmentStore from "../../stores/attachmentStore";

const AttachmentUploader = ({ noteId }) => {
  const { uploadAttachment, isLoading, uploadProgress, error } =
    useAttachmentStore();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;

    // Upload each file
    for (const file of files) {
      const result = await uploadAttachment(noteId, file);
      if (result) {
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    }
  };

  const handleFileInputChange = (e) => {
    handleUpload(e.target.files);
    // Reset the file input so the same file can be uploaded again if needed
    e.target.value = null;
  };

  // Handle drag events for drag and drop functionality
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="attachment-uploader">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        style={{ display: "none" }}
      />

      <motion.div
        className={`dropzone ${isDragging ? "dragging" : ""} ${
          isLoading ? "uploading" : ""
        } ${uploadSuccess ? "success" : ""} ${error ? "error" : ""}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => fileInputRef.current?.click()}
      >
        {isLoading ? (
          <div className="upload-progress">
            <div
              className="progress-bar"
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <div className="progress-text">Uploading... {uploadProgress}%</div>
          </div>
        ) : uploadSuccess ? (
          <div className="upload-success">
            <div className="upload-icon">✓</div>
            <div className="upload-text">File uploaded successfully!</div>
          </div>
        ) : error ? (
          <div className="upload-error">
            <div className="upload-icon">❌</div>
            <div className="upload-text">Error: {error}</div>
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon">📎</div>
            <div className="upload-text">
              {isDragging
                ? "Drop files here"
                : "Click to attach files or drag & drop"}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AttachmentUploader;
