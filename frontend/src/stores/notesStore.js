import { create } from "zustand";
import axios from "axios";

const notesStore = create((set, get) => ({
  notes: [],

  createForm: {
    title: "",
    body: "",
  },

  updateForm: {
    _id: null,
    title: "",
    body: "",
  },

  fetchNotes: async () => {
    try {
      const res = await axios.get("/notes");
      const sortedNotes = (res.data.notes || []).sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      set({ notes: sortedNotes });
    } catch (err) {
      console.error("Error fetching notes:", err);
      set({ notes: [] });
    }
  },

  updateCreateFormField: (e) => {
    const { name, value } = e.target;

    set((state) => {
      return {
        createForm: {
          ...state.createForm,
          [name]: value,
        },
      };
    });
  },

  createNote: async (e, pendingAttachments = []) => {
    e.preventDefault();
    try {
      const { createForm, notes } = get();
      const res = await axios.post("/notes", createForm);

      if (res.data && res.data.note) {
        if (pendingAttachments.length > 0) {
          const noteId = res.data.note._id;
          await Promise.all(
            pendingAttachments.map(async (file) => {
              const formData = new FormData();
              formData.append("file", file);
              try {
                await axios.post(`/attachments/${noteId}`, formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                });
              } catch (error) {
                console.error("Error uploading attachment:", error);
              }
            })
          );
          const updatedRes = await axios.get(`/notes/${noteId}`);
          res.data.note = updatedRes.data.note;
        }
        const newNotes = [res.data.note, ...notes].sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        set({
          notes: newNotes,
          createForm: {
            title: "",
            body: "",
          },
        });
        return res.data;
      }
    } catch (err) {
      console.error("Error creating note:", err);
      return null;
    }
  },

  deleteNote: async (_id) => {
    // Delete the state
    const res = await axios.delete(`/notes/${_id}`);
    const { notes } = notesStore.getState();

    // Update state
    const newNotes = notes.filter((note) => {
      return note._id !== _id;
    });

    set({ notes: newNotes });
  },

  handleUpdateFieldChange: (e) => {
    const { value, name } = e.target;

    set((state) => {
      return {
        updateForm: {
          ...state.updateForm,
          [name]: value,
        },
      };
    });
  },

  toggleUpdate: ({ _id, title, body }) => {
    set((state) => ({
      updateForm: {
        _id: _id || null,
        title: title || "",
        body: body || "",
      },
    }));
  },

  updateNote: async (e) => {
    e.preventDefault();

    const {
      updateForm: { title, body, _id },
      notes,
    } = notesStore.getState();

    // Send the update request
    const res = await axios.put(`/notes/${_id}`, {
      title,
      body,
    });

    // Update state
    const newNotes = [...notes];
    const noteIndex = notes.findIndex((note) => {
      return note._id === _id;
    });
    newNotes[noteIndex] = res.data.note;

    set({
      notes: newNotes,
      updateForm: {
        _id: null,
        title: "",
        body: "",
      },
    });
  },

  sharedNotes: [],

  updateSharedNote: async (noteId, updates) => {
    try {
      const res = await axios.put(`/notes/shared/${noteId}`, updates);
      set((state) => ({
        sharedNotes: state.sharedNotes.map((shared) =>
          shared.note._id === noteId
            ? { ...shared, note: res.data.note }
            : shared
        ),
      }));
      set((state) => ({
        notes: state.notes.map((note) =>
          note._id === noteId ? res.data.note : note
        ),
      }));

      return res.data.note;
    } catch (err) {
      console.error("Error updating shared note:", err);
      throw err;
    }
  },

  togglePin: async (noteId) => {
    const res = await axios.put(`/notes/${noteId}/pin`);
    const notes = get().notes;
    const updatedNotes = notes
      .map((note) => (note._id === noteId ? res.data.note : note))
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    set({ notes: updatedNotes });
  },

  toggleFavorite: async (noteId) => {
    const res = await axios.put(`/notes/${noteId}/favorite`);
    const notes = get().notes.map((note) =>
      note._id === noteId ? res.data.note : note
    );
    set({ notes });
  },

  shareNote: async (noteId, email, permissions) => {
    try {
      await axios.post("/notes/share", { noteId, email, permissions });
    } catch (err) {
      console.error("Error sharing note:", err);
      throw err;
    }
  },

  fetchSharedNotes: async () => {
    try {
      const res = await axios.get("/notes/shared");

      if (res.data && Array.isArray(res.data.sharedNotes)) {
        set({ sharedNotes: res.data.sharedNotes });
      } else {
        console.error("Invalid shared notes data:", res.data);
        set({ sharedNotes: [] });
      }
    } catch (err) {
      console.error("Error fetching shared notes:", err);
      set({ sharedNotes: [] });
    }
  },
}));

export default notesStore;
