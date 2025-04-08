import React from "react";
import { motion } from "framer-motion";

const SharedNoteAttachments = ({ attachments }) => {
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

  return (
    <div className="attachments-container shared-attachments">
      <h4 className="attachments-title">Attachments ({attachments.length})</h4>
      <div className="attachments-list">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="attachments-grid"
        >
          {attachments.map((attachment) => (
            <div
              className="attachment-item shared-attachment-item"
              key={attachment._id}
            >
              <div className="attachment-link">
                <div className="attachment-icon">
                  {getFileIcon(attachment.mimeType)}
                </div>
                <div className="attachment-details">
                  <div className="attachment-name">
                    {attachment.originalFilename}
                  </div>
                  <div className="attachment-meta">
                    {formatFileSize(attachment.size)}
                  </div>
                </div>
                <div
                  className="shared-attachment-badge"
                  title="This is a shared attachment"
                >
                  🔗
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SharedNoteAttachments;
