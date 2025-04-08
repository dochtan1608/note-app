import React, { useState } from "react";
import { motion } from "framer-motion";
import useAttachmentStore from "../../stores/attachmentStore";

const AttachmentItem = ({ attachment, noteId }) => {
  const { deleteAttachment, getDownloadUrl, downloadAttachment } =
    useAttachmentStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Get appropriate icon based on file type
  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith("image/")) return "🖼️";
    if (mimeType.startsWith("video/")) return "🎬";
    if (mimeType.startsWith("audio/")) return "🎵";
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
    if (mimeType.includes("sheet") || mimeType.includes("excel")) return "📊";
    if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
      return "📊";
    return "📎";
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Handle delete click
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  };

  // Handle confirmation
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    await deleteAttachment(attachment._id, noteId);
    setIsDeleting(false);
    setShowConfirm(false);
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  // Handle download click
  const handleDownloadClick = (e) => {
    e.preventDefault();
    downloadAttachment(attachment._id, attachment.originalFilename);
  };

  return (
    <motion.div
      className="attachment-item"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
    >
      {showConfirm ? (
        <div className="attachment-confirm-delete">
          <p>Delete this file?</p>
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
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ) : (
        <a
          href={getDownloadUrl(attachment._id)}
          className="attachment-link"
          onClick={handleDownloadClick}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="attachment-icon">
            {getFileIcon(attachment.mimeType)}
          </div>

          <div className="attachment-details">
            <div className="attachment-name">{attachment.originalFilename}</div>
            <div className="attachment-meta">
              {formatFileSize(attachment.size)}
            </div>
          </div>

          <button
            onClick={handleDeleteClick}
            className="attachment-delete"
            disabled={isDeleting}
            title="Delete attachment"
          >
            {isDeleting ? "⏳" : "🗑️"}
          </button>
        </a>
      )}
    </motion.div>
  );
};

export default AttachmentItem;
