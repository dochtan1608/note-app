import { useEffect } from "react";
import notesStore from "../stores/notesStore";
import Notes from "../components/Notes";
import UpdateForm from "../components/UpdateForm";
import CreateForm from "../components/CreateForm";

export default function NotesPage() {
  const store = notesStore();

  useEffect(() => {
    const loadNotes = async () => {
      try {
        await store.fetchNotes();
      } catch (error) {
        console.error("Error loading notes:", error);
      }
    };
    loadNotes();
  }, []);

  return (
    <div className="notes-page">
      <div className="sidebar">
        <CreateForm />
        {store.updateForm._id && <UpdateForm />}
      </div>
      <div className="main-content">
        <Notes notes={store.notes} />
      </div>
    </div>
  );
}
