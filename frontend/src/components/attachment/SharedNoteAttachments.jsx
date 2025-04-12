import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const SharedNoteAttachments = ({ attachments }) => {
  const [downloadingId, setDownloadingId] = useState(null);

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

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const downloadAttachment = async (attachment) => {
    try {
      setDownloadingId(attachment._id);

      const response = await axios.get(
        `/shared-attachments/${attachment._id}/download`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        attachment.originalFilename || "attachment"
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading shared attachment:", error);
      alert("Failed to download the attachment");
    } finally {
      setDownloadingId(null);
    }
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
              <div
                className="attachment-link"
                onClick={() => downloadAttachment(attachment)}
                style={{ cursor: "pointer" }}
              >
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
                <div className="attachment-action">
                  {downloadingId === attachment._id ? (
                    <span className="downloading-spinner">⏳</span>
                  ) : (
                    <span className="download-icon" title="Download attachment">
                      ⬇️
                    </span>
                  )}
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
