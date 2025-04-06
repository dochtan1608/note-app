import { useEffect } from "react";
import notesStore from "../stores/notesStore";
import SharedNotes from "../components/SharedNotes";

export default function SharedNotesPage() {
  const store = notesStore();

  useEffect(() => {
    const loadSharedNotes = async () => {
      try {
        await store.fetchSharedNotes();
      } catch (error) {
        console.error("Error loading shared notes:", error);
      }
    };

    loadSharedNotes();
  }, []);

  return (
    <div className="shared-page">
      <div className="shared-page-container">
        <div className="page-header">
          <h1>Shared Notes</h1>
          <p className="page-description">Notes others have shared with you</p>
        </div>
        <SharedNotes />
      </div>
    </div>
  );
}
