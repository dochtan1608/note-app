import { useEffect } from "react";
import notesStore from "../stores/notesStore";
import Notes from "../components/Notes";
import UpdateForm from "../components/UpdateForm";
import CreateForm from "../components/CreateForm";

export default function NotesPage() {
  const store = notesStore();

  useEffect(() => {
    store.fetchNotes();
  }, []);

  return (
    <div className="notes-page">
      <div className="notes-layout">
        <div className="notes-section">
          <Notes />
        </div>
        <div className="forms-section">
          <div className="create-section">
            <h2>Create Note</h2>
            <CreateForm />
          </div>
          <UpdateForm />
        </div>
      </div>
    </div>
  );
}
