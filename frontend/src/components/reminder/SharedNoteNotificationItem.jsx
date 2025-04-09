import React from "react";
import { motion } from "framer-motion";
import { simpleFormatDistanceToNow as formatDistanceToNow } from "../SimpleFallbacks";
import notesStore from "../../stores/notesStore";

const SharedNoteNotificationItem = ({ notification }) => {
  const { acceptSharedNote, rejectSharedNote } = notesStore();

  const { _id, note, sharedBy } = notification;
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt));

  const handleAccept = async (e) => {
    e.stopPropagation();
    await acceptSharedNote(_id);
  };

  const handleReject = async (e) => {
    e.stopPropagation();
    await rejectSharedNote(_id);
  };

  return (
    <motion.div
      className="notification-item"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, padding: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: "16px",
        borderBottom: "1px solid var(--border-color)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "4px",
          backgroundColor: "var(--primary-color)",
        }}
      />

      <div style={{ paddingLeft: "8px" }}>
        <div
          className="notification-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "8px",
          }}
        >
          <h4
            style={{
              margin: 0,
              fontWeight: 600,
              fontSize: "16px",
            }}
          >
            <span
              style={{
                color: "var(--primary-color)",
                fontSize: "14px",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Note invite from {sharedBy ? sharedBy.email : "a user"}
            </span>
            {note ? note.title : "Shared Note"}
          </h4>
          <span
            style={{
              fontSize: "12px",
              color: "var(--text-medium)",
              whiteSpace: "nowrap",
              marginLeft: "8px",
            }}
          >
            {timeAgo}
          </span>
        </div>

        {note && note.body && (
          <p
            style={{
              margin: "4px 0 12px",
              fontSize: "14px",
              color: "var(--text-medium)",
              lineHeight: 1.5,
            }}
          >
            {note.body.length > 100
              ? `${note.body.substring(0, 100)}...`
              : note.body}
          </p>
        )}

        <div
          className="notification-actions"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          <button
            onClick={handleReject}
            className="btn-dismiss"
            style={{
              padding: "6px 12px",
              fontSize: "13px",
              borderRadius: "6px",
              background: "rgba(0,0,0,0.05)",
              border: "none",
              color: "var(--text-medium)",
              cursor: "pointer",
            }}
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="btn-accept"
            style={{
              padding: "6px 12px",
              fontSize: "13px",
              borderRadius: "6px",
              background: "var(--success-color)",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SharedNoteNotificationItem;
