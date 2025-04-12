import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useReminderStore from "../stores/reminderStore";
import { simpleFormat as format } from "../components/SimpleFallbacks";
import LoadingSpinner from "../components/LoadingSpinner";
import CreateReminderModal from "../components/reminder/CreateReminderModal";
import ShareReminderModal from "../components/reminder/ShareReminderModal";

const RemindersPage = () => {
  const {
    reminders,
    fetchReminders,
    isLoading,
    error,
    deleteReminder,
    completeReminder,
    dismissReminder,
    toggleCreateModal,
    toggleShareReminderModal,
  } = useReminderStore();

  const [filter, setFilter] = useState("all"); // all, pending, completed, dismissed

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const filteredReminders = reminders.filter((reminder) => {
    if (filter === "all") return true;
    return reminder.status === filter;
  });

  const sortedReminders = [...filteredReminders].sort((a, b) => {
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
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
  const formatDueDate = (date) => {
    return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
  };
  const isOverdue = (dueDate, status) => {
    return status === "pending" && new Date(dueDate) < new Date();
  };
  const getStatusColor = (status, dueDate) => {
    if (isOverdue(dueDate, status)) return "var(--danger-color)";

    switch (status) {
      case "completed":
        return "var(--success-color)";
      case "dismissed":
        return "var(--secondary-color)";
      default:
        return "var(--primary-color)";
    }
  };
  const getStatusText = (status, dueDate) => {
    if (isOverdue(dueDate, status)) return "Overdue";

    switch (status) {
      case "completed":
        return "Completed";
      case "dismissed":
        return "Dismissed";
      default:
        return "Pending";
    }
  };

  return (
    <motion.div
      className="reminders-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: "2rem 1rem" }}
    >
      <div
        className="reminders-container"
        style={{ maxWidth: "1100px", margin: "0 auto" }}
      >
        <motion.div
          className="page-header"
          style={{
            marginBottom: "2rem",
            borderBottom: "1px solid var(--border-color)",
            paddingBottom: "1.5rem",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 700,
              margin: "0 0 0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <span>⏰</span> Reminders
          </h1>
          <p
            className="page-description"
            style={{
              fontSize: "1rem",
              maxWidth: "600px",
              margin: "0 0 1rem",
            }}
          >
            Manage your reminders and never miss an important task
          </p>

          <motion.button
            onClick={() => toggleCreateModal(true)}
            className="btn-create"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ marginTop: "0.5rem" }}
          >
            Create Reminder
          </motion.button>
        </motion.div>

        <div className="reminders-tabs" style={{ marginBottom: "1.5rem" }}>
          <div className="tabs">
            {["all", "pending", "completed", "dismissed"].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`tab ${filter === tab ? "active" : ""}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab !== "all" && (
                  <span style={{ marginLeft: "0.25rem" }}>
                    ({reminders.filter((r) => r.status === tab).length})
                  </span>
                )}
                {tab === "all" && (
                  <span style={{ marginLeft: "0.25rem" }}>
                    ({reminders.length})
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div
            className="error-message"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "var(--danger-color)",
              padding: "1rem",
              borderRadius: "8px",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        ) : sortedReminders.length > 0 ? (
          <motion.div
            className="reminders-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            }}
          >
            {sortedReminders.map((reminder) => (
              <motion.div
                key={reminder._id}
                className="reminder-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: "1.5rem",
                  background: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "4px",
                    bottom: 0,
                    background: getPriorityColor(reminder.priority),
                  }}
                />

                <div style={{ paddingLeft: "8px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "1rem",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.25rem",
                        fontWeight: 600,
                      }}
                    >
                      {reminder.title}
                      {reminder.isShared && (
                        <span
                          style={{
                            fontSize: "12px",
                            background: "rgba(37, 99, 235, 0.1)",
                            color: "var(--primary-color)",
                            padding: "2px 6px",
                            borderRadius: "10px",
                            marginLeft: "8px",
                          }}
                        >
                          Shared
                        </span>
                      )}
                    </h3>

                    <div
                      style={{
                        background: "rgba(0,0,0,0.05)",
                        fontSize: "0.875rem",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        color: getStatusColor(
                          reminder.status,
                          reminder.dueDate
                        ),
                      }}
                    >
                      {getStatusText(reminder.status, reminder.dueDate)}
                    </div>
                  </div>

                  {reminder.description && (
                    <p
                      style={{
                        margin: "0 0 1rem",
                        fontSize: "0.95rem",
                        color: "var(--text-medium)",
                        lineHeight: 1.6,
                      }}
                    >
                      {reminder.description}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "0.875rem",
                      color: "var(--text-medium)",
                      marginBottom: "1rem",
                      gap: "0.5rem",
                    }}
                  >
                    <span role="img" aria-label="calendar">
                      📅
                    </span>
                    <span>
                      Due:{" "}
                      <span
                        style={{
                          color: isOverdue(reminder.dueDate, reminder.status)
                            ? "var(--danger-color)"
                            : "inherit",
                          fontWeight: isOverdue(
                            reminder.dueDate,
                            reminder.status
                          )
                            ? 600
                            : "inherit",
                        }}
                      >
                        {formatDueDate(reminder.dueDate)}
                      </span>
                    </span>
                    {reminder.status === "pending" && (
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleShareReminderModal(true, reminder._id);
                        }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          marginLeft: "auto",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "1rem",
                          color: "var(--primary-color)",
                          padding: "0",
                          display: "flex",
                          alignItems: "center",
                        }}
                        title="Share this reminder"
                      >
                        📤
                      </motion.button>
                    )}
                  </div>
                  {reminder.sharedWith && reminder.sharedWith.length > 0 && (
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-medium)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "1rem",
                        padding: "0.5rem",
                        background: "rgba(0,0,0,0.03)",
                        borderRadius: "6px",
                      }}
                    >
                      <span role="img" aria-label="share">
                        👥
                      </span>
                      <span>
                        Shared with {reminder.sharedWith.length} user
                        {reminder.sharedWith.length !== 1 && "s"}
                      </span>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "0.5rem",
                      marginTop: "1rem",
                    }}
                  >
                    {reminder.status === "pending" && (
                      <>
                        <motion.button
                          onClick={() => dismissReminder(reminder._id)}
                          className="btn-dismiss"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            padding: "0.5rem 1rem",
                            background: "rgba(0,0,0,0.05)",
                            border: "none",
                            borderRadius: "6px",
                            color: "var(--text-medium)",
                            fontSize: "0.875rem",
                            cursor: "pointer",
                          }}
                        >
                          Dismiss
                        </motion.button>
                        <motion.button
                          onClick={() => completeReminder(reminder._id)}
                          className="btn-complete"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            padding: "0.5rem 1rem",
                            background: "var(--success-color)",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "0.875rem",
                            cursor: "pointer",
                          }}
                        >
                          Complete
                        </motion.button>
                      </>
                    )}
                    <motion.button
                      onClick={() => deleteReminder(reminder._id)}
                      className="btn-delete-reminder"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "var(--danger-color)",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "0.875rem",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div
            className="empty-reminders"
            style={{
              textAlign: "center",
              padding: "3rem 0",
              color: "var(--text-medium)",
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{ fontSize: "4rem", marginBottom: "1rem" }}
            >
              ⏰
            </motion.div>
            <h3 style={{ margin: "0 0 0.5rem", fontWeight: 600 }}>
              No {filter !== "all" ? filter : ""} reminders found
            </h3>
            <p style={{ margin: 0, fontSize: "0.95rem" }}>
              {filter === "all"
                ? "Create your first reminder using the button above"
                : `No reminders with ${filter} status`}
            </p>
          </div>
        )}
      </div>

      <CreateReminderModal />
      <ShareReminderModal />
    </motion.div>
  );
};

export default RemindersPage;
