import { create } from "zustand";
import notesStore from "./notesStore";

const useSearchStore = create((set, get) => ({
  searchTerm: "",
  showResults: false,
  searchResults: [],
  selectedResultIndex: -1,
  isSearching: false,
  error: null,
  setSearchTerm: (term) => {
    set({ searchTerm: term });

    if (!term.trim()) {
      set({ searchResults: [], showResults: false });
      return;
    }
    set({ isSearching: true, showResults: true });

    try {
      // Get notes from store
      const notes = notesStore.getState().notes;
      const sharedNotes = notesStore.getState().sharedNotes;

      // Search in user's notes
      const noteResults = notes
        .filter(
          (note) =>
            note.title.toLowerCase().includes(term.toLowerCase()) ||
            note.body.toLowerCase().includes(term.toLowerCase())
        )
        .map((note) => ({
          id: note._id,
          type: "note",
          title: note.title,
          preview:
            note.body.substring(0, 60) + (note.body.length > 60 ? "..." : ""),
          data: note,
        }));

      // Search in shared notes
      const sharedResults = sharedNotes
        ? sharedNotes
            .filter(
              (shared) =>
                shared.note?.title.toLowerCase().includes(term.toLowerCase()) ||
                shared.note?.body.toLowerCase().includes(term.toLowerCase())
            )
            .map((shared) => ({
              id: shared._id,
              type: "shared",
              title: shared.note?.title || "Untitled",
              preview:
                shared.note?.body.substring(0, 60) +
                (shared.note?.body.length > 60 ? "..." : ""),
              sharedBy: shared.sharedBy?.email,
              data: shared,
            }))
        : [];

      // Combine and set results
      set({
        searchResults: [...noteResults, ...sharedResults],
        isSearching: false,
        error: null,
      });
    } catch (error) {
      set({ isSearching: false, error: "Error searching notes" });
      console.error("Search error:", error);
    }
  },

  toggleResults: (show) => set({ showResults: show }),

  clearSearch: () =>
    set({
      searchTerm: "",
      showResults: false,
      searchResults: [],
      selectedResultIndex: -1,
    }),

  navigateResults: (direction) => {
    const { selectedResultIndex, searchResults } = get();
    let newIndex;

    if (direction === "down") {
      newIndex = Math.min(selectedResultIndex + 1, searchResults.length - 1);
    } else {
      newIndex = Math.max(selectedResultIndex - 1, 0);
    }

    if (newIndex !== selectedResultIndex) {
      set({ selectedResultIndex: newIndex });
    }
  },

  selectResult: (index) => set({ selectedResultIndex: index }),
}));

export default useSearchStore;
