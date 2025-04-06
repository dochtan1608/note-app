import { useEffect } from "react";
import notesStore from "../stores/notesStore";
import SharedNotes from "../components/SharedNotes";

export default function SharedNotesPage() {
  const store = notesStore();

  useEffect(() => {
    store.fetchSharedNotes();
  }, []);

  return (
    <div className="notes-page">
      <div className="main-content">
        <SharedNotes />
      </div>
    </div>
  );
}
