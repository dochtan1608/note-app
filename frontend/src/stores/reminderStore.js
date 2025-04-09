import { create } from "zustand";
import axios from "axios";

const useReminderStore = create((set, get) => ({
  reminders: [],
  notifications: {
    reminders: [],
    sharedInvites: [],
  },
  activeReminder: null,
  isLoading: false,
  error: null,
  showCreateModal: false,
  showShareReminderModal: false,
  showNotificationsPopup: false,
  createForm: {
    title: "",
    description: "",
    dueDate: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDThh:mm
    priority: "medium",
    noteId: "",
  },
  shareForm: {
    email: "",
    reminderId: "",
  },

  toggleCreateModal: (show = null) => {
    set((state) => ({
      showCreateModal: show !== null ? show : !state.showCreateModal,
      createForm: show
        ? {
            title: "",
            description: "",
            dueDate: new Date().toISOString().slice(0, 16),
            priority: "medium",
            noteId: "",
          }
        : state.createForm,
    }));
  },

  toggleShareReminderModal: (show = null, reminderId = "") => {
    set((state) => ({
      showShareReminderModal:
        show !== null ? show : !state.showShareReminderModal,
      shareForm: {
        email: "",
        reminderId: reminderId || state.shareForm.reminderId,
      },
    }));
  },

  toggleNotificationsPopup: (show = null) => {
    set((state) => ({
      showNotificationsPopup:
        show !== null ? show : !state.showNotificationsPopup,
    }));
  },
  updateCreateForm: (e) => {
    const { name, value } = e.target;
    set((state) => ({
      createForm: {
        ...state.createForm,
        [name]: value,
      },
    }));
  },

  updateShareForm: (e) => {
    const { name, value } = e.target;
    set((state) => ({
      shareForm: {
        ...state.shareForm,
        [name]: value,
      },
    }));
  },

  // API calls
  fetchReminders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/reminders");
      set({ reminders: response.data.reminders, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch reminders:", error);
      set({
        error: error.response?.data?.error || "Failed to load reminders",
        isLoading: false,
      });
    }
  },

  checkNotifications: async () => {
    try {
      const response = await axios.get("/notifications/pending");
      set({
        notifications: {
          reminders: response.data.reminders || [],
          sharedInvites: response.data.sharedInvites || [],
        },
      });

      return [
        ...(response.data.reminders || []),
        ...(response.data.sharedInvites || []),
      ];
    } catch (error) {
      console.error("Failed to check notifications:", error);
      return [];
    }
  },

  markNotificationsAsRead: async (reminderIds) => {
    try {
      await axios.post("/notifications/mark-read", { reminderIds });
      set((state) => ({
        notifications: {
          ...state.notifications,
          reminders: state.notifications.reminders.filter(
            (notif) => !reminderIds.includes(notif._id)
          ),
        },
      }));
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  },

  createReminder: async () => {
    set({ isLoading: true, error: null });
    try {
      const { createForm } = get();
      const response = await axios.post("/reminders", createForm);

      set((state) => ({
        reminders: [response.data.reminder, ...state.reminders],
        isLoading: false,
        showCreateModal: false,
        createForm: {
          title: "",
          description: "",
          dueDate: new Date().toISOString().slice(0, 16),
          priority: "medium",
          noteId: "",
        },
      }));

      return true;
    } catch (error) {
      console.error("Failed to create reminder:", error);
      set({
        error: error.response?.data?.error || "Failed to create reminder",
        isLoading: false,
      });
      return false;
    }
  },

  updateReminder: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`/reminders/${id}`, updates);

      set((state) => ({
        reminders: state.reminders.map((reminder) =>
          reminder._id === id ? response.data.reminder : reminder
        ),
        isLoading: false,
      }));
      set((state) => ({
        notifications: {
          ...state.notifications,
          reminders: state.notifications.reminders.filter(
            (notif) => notif._id !== id
          ),
        },
      }));

      return true;
    } catch (error) {
      console.error("Failed to update reminder:", error);
      set({
        error: error.response?.data?.error || "Failed to update reminder",
        isLoading: false,
      });
      return false;
    }
  },

  completeReminder: async (id) => {
    return get().updateReminder(id, { status: "completed" });
  },

  dismissReminder: async (id) => {
    return get().updateReminder(id, { status: "dismissed" });
  },

  deleteReminder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/reminders/${id}`);

      set((state) => ({
        reminders: state.reminders.filter((reminder) => reminder._id !== id),
        notifications: {
          ...state.notifications,
          reminders: state.notifications.reminders.filter(
            (notif) => notif._id !== id
          ),
        },
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error("Failed to delete reminder:", error);
      set({
        error: error.response?.data?.error || "Failed to delete reminder",
        isLoading: false,
      });
      return false;
    }
  },

  shareReminder: async () => {
    set({ isLoading: true, error: null });
    try {
      const { shareForm } = get();

      // Check if email and reminderId are provided
      if (!shareForm.email || !shareForm.reminderId) {
        set({
          error: "Email and reminder must be provided",
          isLoading: false,
        });
        return false;
      }

      const response = await axios.post("/reminders/share", shareForm);

      set({
        isLoading: false,
        error: null,
        showShareReminderModal: false,
        shareForm: { email: "", reminderId: "" },
      });

      return true;
    } catch (error) {
      console.error("Failed to share reminder:", error);
      set({
        error: error.response?.data?.error || "Failed to share reminder",
        isLoading: false,
      });
      return false;
    }
  },

  acceptReminderShare: async (reminderId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`/reminders/shared/${reminderId}`, {
        status: "accepted",
      });
      set((state) => ({
        notifications: {
          ...state.notifications,
          sharedInvites: state.notifications.sharedInvites.filter(
            (invite) => invite._id !== reminderId
          ),
        },
        isLoading: false,
      }));
      get().fetchReminders();

      return true;
    } catch (error) {
      console.error("Failed to accept shared reminder:", error);
      set({
        error: error.response?.data?.error || "Failed to accept reminder",
        isLoading: false,
      });
      return false;
    }
  },

  rejectReminderShare: async (reminderId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`/reminders/shared/${reminderId}`, {
        status: "rejected",
      });
      set((state) => ({
        notifications: {
          ...state.notifications,
          sharedInvites: state.notifications.sharedInvites.filter(
            (invite) => invite._id !== reminderId
          ),
        },
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error("Failed to reject shared reminder:", error);
      set({
        error: error.response?.data?.error || "Failed to reject reminder",
        isLoading: false,
      });
      return false;
    }
  },

  markSharedReminderAsRead: async (reminderId) => {
    try {
      await axios.put(`/reminders/shared/${reminderId}/notify`);
      set((state) => ({
        notifications: {
          ...state.notifications,
          sharedInvites: state.notifications.sharedInvites.filter(
            (invite) => invite._id !== reminderId
          ),
        },
      }));
    } catch (error) {
      console.error("Failed to mark shared reminder as read:", error);
    }
  },
}));

export default useReminderStore;
