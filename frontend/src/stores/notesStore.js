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
      console.log("Fetching notes response:", res.data);

      // Sort notes - pinned notes first, then by creation date
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

  createNote: async (e) => {
    e.preventDefault();
    try {
      const { createForm, notes } = get();
      const res = await axios.post("/notes", createForm);
      console.log("Create Note Response:", res.data);

      if (res.data && res.data.note) {
        // Sort notes - pinned notes first, then by creation date
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
      }
    } catch (err) {
      console.error("Error creating note:", err);
    }
  },

  deleteNote: async (_id) => {
    // Delete the note
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
    await axios.post("/notes/share", {
      noteId,
      email,
      permissions,
    });
  },

  fetchSharedNotes: async () => {
    const res = await axios.get("/notes/shared");
    set({ sharedNotes: res.data.sharedNotes });
  },
}));

export default notesStore;
