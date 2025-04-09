import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useReminderStore from "../../stores/reminderStore";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = () => {
  const {
    notifications,
    checkNotifications,
    toggleNotificationsPopup,
    showNotificationsPopup,
  } = useReminderStore();
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const totalNotifications =
    notifications.reminders.length + notifications.sharedInvites.length;

  useEffect(() => {
    // check new noti
    const fetchNotifications = async () => {
      const fetched = await checkNotifications();
      const hasNew = fetched && fetched.length > 0;

      if (!isFirstLoad && hasNew && !hasNewNotifications) {
        setHasNewNotifications(true);
      } else {
        setHasNewNotifications(hasNew);
      }

      if (isFirstLoad) setIsFirstLoad(false);
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [
    checkNotifications,
    hasNewNotifications,
    isFirstLoad,
    setHasNewNotifications,
    setIsFirstLoad,
  ]);

  useEffect(() => {
    if (showNotificationsPopup) {
      setHasNewNotifications(false);
    }
  }, [showNotificationsPopup]);

  const bellAnimation = {
    initial: { rotate: 0 },
    animate: hasNewNotifications
      ? {
          rotate: [0, 15, -15, 12, -12, 8, -8, 5, -5, 0],
          transition: {
            duration: 1.5,
            repeat: 3,
            repeatType: "reverse",
            ease: "easeInOut",
          },
        }
      : {},
  };

  const badgeAnimation = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <div style={{ position: "relative" }}>
      <motion.button
        className="notification-bell"
        onClick={() => toggleNotificationsPopup()}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
          position: "relative",
          padding: "6px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-dark)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial="initial"
        animate={hasNewNotifications ? "animate" : "initial"}
        variants={bellAnimation}
      >
        🔔
        <AnimatePresence>
          {totalNotifications > 0 && (
            <motion.div
              className="notification-badge"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "var(--danger-color)",
                color: "white",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={badgeAnimation}
            >
              {totalNotifications}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <NotificationDropdown />
    </div>
  );
};

export default NotificationBell;
