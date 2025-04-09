import React, { useEffect, useState } from "react";
import useReminderStore from "../stores/reminderStore";
import notesStore from "../stores/notesStore";
import NotificationBell from "./reminder/NotificationBell";

const NotificationManager = () => {
  const [allNotifications, setAllNotifications] = useState({
    reminders: [],
    sharedInvites: [],
    sharedNotes: [],
  });

  const { checkNotifications } = useReminderStore();
  const { fetchPendingSharedNotes } = notesStore();
  useEffect(() => {
    const fetchAllNotifications = async () => {
      const reminderData = await checkNotifications();
      const pendingSharedNotes = await fetchPendingSharedNotes();

      setAllNotifications({
        reminders: reminderData.reminders || [],
        sharedInvites: reminderData.sharedInvites || [],
        sharedNotes: pendingSharedNotes || [],
      });
    };

    fetchAllNotifications();

    const interval = setInterval(fetchAllNotifications, 30000);
    return () => clearInterval(interval);
  }, [checkNotifications, fetchPendingSharedNotes]);
  const totalNotificationCount =
    allNotifications.reminders.length +
    allNotifications.sharedInvites.length +
    allNotifications.sharedNotes.length;

  return (
    <NotificationBell
      totalCount={totalNotificationCount}
      allNotifications={allNotifications}
    />
  );
};

export default NotificationManager;
