import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAttachmentStore from "../../stores/attachmentStore";
import AttachmentItem from "./AttachmentItem";

const AttachmentList = ({ noteId }) => {
  const { attachments, fetchNoteAttachments, isLoading, error } =
    useAttachmentStore();
  const [fetchAttempted, setFetchAttempted] = useState(false);

  useEffect(() => {
    if (noteId) {
      fetchNoteAttachments(noteId);
      setFetchAttempted(true);
    }
  }, [noteId, fetchNoteAttachments]);

  const noteAttachments = attachments[noteId] || [];

  if (isLoading) {
    return <div className="attachment-loading">Loading attachments...</div>;
  }

  if (error && fetchAttempted) {
    return (
      <div className="attachment-error">
        <p>Error loading attachments: {error}</p>
        <button
          onClick={() => fetchNoteAttachments(noteId)}
          className="btn-retry"
        >
          Retry
        </button>
      </div>
    );
  }

  if (noteAttachments.length === 0 && fetchAttempted) {
    return null;
  }

  return (
    <div className="attachments-container">
      <h4 className="attachments-title">
        Attachments ({noteAttachments.length})
      </h4>
      <div className="attachments-list">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="attachments-grid"
        >
          {noteAttachments.map((attachment) => (
            <AttachmentItem
              key={attachment._id}
              attachment={attachment}
              noteId={noteId}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AttachmentList;
