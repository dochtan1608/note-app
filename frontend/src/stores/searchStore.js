import { create } from "zustand";
import notesStore from "./notesStore";
import useReminderStore from "./reminderStore";

const useSearchStore = create((set, get) => ({
  searchTerm: "",
  searchResults: [],
  isSearching: false,
  showResults: false,
  selectedResultIndex: -1,

  setSearchTerm: (term) => {
    set({ searchTerm: term });

    // If term is empty, clear results and hide dropdown
    if (!term.trim()) {
      set({
        searchResults: [],
        showResults: false,
        selectedResultIndex: -1,
      });
      return;
    }

    // Start searching
    set({ isSearching: true, showResults: true });

    // Perform the search
    const results = get().performSearch(term);

    // Update results
    set({
      searchResults: results,
      isSearching: false,
      selectedResultIndex: results.length > 0 ? 0 : -1,
    });
  },

  performSearch: (term) => {
    const results = [];
    const searchTerm = term.toLowerCase();

    // Get data from stores
    const notes = notesStore.getState().notes || [];
    const sharedNotes = notesStore.getState().sharedNotes || [];
    const reminders = useReminderStore.getState().reminders || [];

    // Search in notes
    notes.forEach((note) => {
      if (
        note.title.toLowerCase().includes(searchTerm) ||
        note.body.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: note._id,
          title: note.title,
          preview:
            note.body.substring(0, 50) + (note.body.length > 50 ? "..." : ""),
          type: "note",
          data: note,
        });
      }
    });

    // Search in shared notes
    sharedNotes.forEach((sharedNote) => {
      if (
        sharedNote.note?.title.toLowerCase().includes(searchTerm) ||
        sharedNote.note?.body.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: sharedNote.note._id,
          title: sharedNote.note.title,
          preview:
            sharedNote.note.body.substring(0, 50) +
            (sharedNote.note.body.length > 50 ? "..." : ""),
          type: "shared",
          sharedBy: sharedNote.sharedBy?.email || "Unknown",
          data: sharedNote,
        });
      }
    });

    // Search in reminders
    reminders.forEach((reminder) => {
      if (
        reminder.title.toLowerCase().includes(searchTerm) ||
        (reminder.description &&
          reminder.description.toLowerCase().includes(searchTerm))
      ) {
        results.push({
          id: reminder._id,
          title: reminder.title,
          preview: reminder.description
            ? reminder.description.substring(0, 50) +
              (reminder.description.length > 50 ? "..." : "")
            : "No description",
          type: "reminder",
          data: reminder,
        });
      }
    });

    return results;
  },

  toggleResults: (show = null) => {
    set((state) => ({
      showResults: show !== null ? show : !state.showResults,
    }));
  },

  clearSearch: () => {
    set({
      searchTerm: "",
      searchResults: [],
      showResults: false,
      selectedResultIndex: -1,
    });
  },

  navigateResults: (direction) => {
    set((state) => {
      const { selectedResultIndex, searchResults } = state;
      let newIndex = selectedResultIndex;

      if (direction === "down") {
        newIndex = Math.min(selectedResultIndex + 1, searchResults.length - 1);
      } else if (direction === "up") {
        newIndex = Math.max(selectedResultIndex - 1, 0);
      }

      return { selectedResultIndex: newIndex };
    });
  },

  selectResult: (index) => {
    set({ selectedResultIndex: index });
  },
}));

export default useSearchStore;
