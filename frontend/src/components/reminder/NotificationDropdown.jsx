import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useReminderStore from "../../stores/reminderStore";
import NotificationItem from "./NotificationItem";

const NotificationDropdown = ({ position = { top: "100%", right: "0" } }) => {
  const {
    notifications,
    showNotificationsPopup,
    toggleNotificationsPopup,
    markNotificationsAsRead,
  } = useReminderStore();

  const dropdownRef = useRef(null);

  // Calculate total number of notifications
  const totalNotifications =
    notifications.reminders.length + notifications.sharedInvites.length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (showNotificationsPopup) toggleNotificationsPopup(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showNotificationsPopup, toggleNotificationsPopup]);

  // Mark all as read
  const markAllAsRead = async () => {
    if (notifications.reminders.length > 0) {
      const ids = notifications.reminders.map((notif) => notif._id);
      await markNotificationsAsRead(ids);
    }
  };

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {showNotificationsPopup && (
        <motion.div
          className="notification-dropdown"
          ref={dropdownRef}
          style={{
            position: "absolute",
            ...position,
            width: "320px",
            maxHeight: "400px",
            overflowY: "auto",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={dropdownVariants}
        >
          <div
            className="notification-header"
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, fontWeight: 600 }}>Notifications</h3>
            {notifications.reminders.length > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary-color)",
                  fontSize: "14px",
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}
                className="mark-all-read"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {totalNotifications > 0 ? (
              <AnimatePresence>
                {/* First show shared reminder invites */}
                {notifications.sharedInvites.map((notification) => (
                  <NotificationItem
                    key={`share-${notification._id}`}
                    notification={notification}
                    type="share"
                  />
                ))}

                {/* Then show regular reminders */}
                {notifications.reminders.map((notification) => (
                  <NotificationItem
                    key={`reminder-${notification._id}`}
                    notification={notification}
                    type="reminder"
                  />
                ))}
              </AnimatePresence>
            ) : (
              <div
                className="empty-notifications"
                style={{
                  padding: "24px 16px",
                  textAlign: "center",
                  color: "var(--text-medium)",
                }}
              >
                <p style={{ margin: 0 }}>No new notifications</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;
