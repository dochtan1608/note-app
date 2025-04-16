import React from "react";
import { motion } from "framer-motion";
import { simpleFormatDistanceToNow as formatDistanceToNow } from "../SimpleFallbacks";
import useReminderStore from "../../stores/reminderStore";

const NotificationItem = ({ notification, type }) => {
  const {
    completeReminder,
    dismissReminder,
    acceptReminderShare,
    rejectReminderShare,
  } = useReminderStore();

  const isReminderNotification = type === "reminder";
  const isShareNotification = type === "share";

  const { _id, title, description, priority, dueDate } = notification;
  const creator = isShareNotification ? notification.creator : null;

  const timeAgo = formatDistanceToNow(new Date(dueDate));

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "var(--danger-color)";
      case "medium":
        return "var(--warning-color)";
      case "low":
        return "var(--info-color)";
      default:
        return "var(--secondary-color)";
    }
  };

  const handleComplete = async (e) => {
    e.stopPropagation();
    await completeReminder(_id);
  };

  const handleDismiss = async (e) => {
    e.stopPropagation();
    await dismissReminder(_id);
  };

  const handleAccept = async (e) => {
    e.stopPropagation();
    await acceptReminderShare(_id);
  };

  const handleReject = async (e) => {
    e.stopPropagation();
    await rejectReminderShare(_id);
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
          backgroundColor: getPriorityColor(priority),
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
            {isShareNotification && (
              <span
                style={{
                  color: "var(--primary-color)",
                  fontSize: "14px",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Reminder invite from {creator ? creator.username : "a user"}
              </span>
            )}
            {title}
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

        {description && (
          <p
            style={{
              margin: "4px 0 12px",
              fontSize: "0.95rem",
              color: "var(--text-medium)",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {description}
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
          {isReminderNotification ? (
            <>
              <button
                onClick={handleDismiss}
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
                Dismiss
              </button>
              <button
                onClick={handleComplete}
                className="btn-complete"
                style={{
                  padding: "6px 12px",
                  fontSize: "13px",
                  borderRadius: "6px",
                  background: "var(--primary-color)",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Complete
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationItem;
