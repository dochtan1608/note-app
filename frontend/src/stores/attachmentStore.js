import { create } from "zustand";
import axios from "axios";

const useAttachmentStore = create((set, get) => ({
  attachments: {},
  isLoading: false,
  error: null,
  uploadProgress: 0,

  // Fetch attachments for a specific note
  fetchNoteAttachments: async (noteId) => {
    set({ isLoading: true, error: null });
    try {
      console.log(`Attempting to fetch attachments for note: ${noteId}`);
      const response = await axios.get(`/attachments/note/${noteId}`);
      console.log(`Attachment response:`, response.data);

      set((state) => ({
        attachments: {
          ...state.attachments,
          [noteId]: response.data.attachments || [],
        },
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to fetch attachments:", error);

      // Add more detailed error logging
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      } else if (error.request) {
        console.error("Error request:", error.request);
      }

      set({
        attachments: { ...get().attachments, [noteId]: [] },
        error: error.response?.data?.error || "Failed to load attachments",
        isLoading: false,
      });
    }
  },

  // Upload an attachment
  uploadAttachment: async (noteId, file) => {
    set({ isLoading: true, error: null, uploadProgress: 0 });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`/attachments/${noteId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          set({ uploadProgress: percentCompleted });
        },
      });

      // Update attachments list
      set((state) => {
        const currentAttachments = state.attachments[noteId] || [];
        return {
          attachments: {
            ...state.attachments,
            [noteId]: [...currentAttachments, response.data.attachment],
          },
          isLoading: false,
          uploadProgress: 0,
        };
      });

      return response.data.attachment;
    } catch (error) {
      console.error("Failed to upload attachment:", error);
      set({
        error: error.response?.data?.error || "Failed to upload attachment",
        isLoading: false,
        uploadProgress: 0,
      });
      return null;
    }
  },

  // Delete an attachment
  deleteAttachment: async (attachmentId, noteId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/attachments/${attachmentId}`);
      // Remove attachment from state
      set((state) => {
        const noteAttachments = state.attachments[noteId] || [];
        return {
          attachments: {
            ...state.attachments,
            [noteId]: noteAttachments.filter((att) => att._id !== attachmentId),
          },
          isLoading: false,
        };
      });
      return true;
    } catch (error) {
      console.error("Failed to delete attachment:", error);
      set({
        error: error.response?.data?.error || "Failed to delete attachment",
        isLoading: false,
      });
      return false;
    }
  },

  // Download helper - returns download URL
  getDownloadUrl: (attachmentId) => {
    // Create an absolute URL instead of a relative path
    return `/attachments/${attachmentId}/download`;
  },

  // Add a method for direct download
  downloadAttachment: async (attachmentId, filename) => {
    try {
      const response = await axios.get(
        `/attachments/${attachmentId}/download`,
        {
          responseType: "blob",
        }
      );

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename || "attachment");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error("Failed to download attachment:", error);
      set({
        error: "Failed to download attachment",
        isLoading: false,
      });
      return false;
    }
  },

  // Clear all attachments for a note
  clearNoteAttachments: (noteId) => {
    set((state) => {
      const newAttachments = { ...state.attachments };
      delete newAttachments[noteId];
      return { attachments: newAttachments };
    });
  },
}));

export default useAttachmentStore;
