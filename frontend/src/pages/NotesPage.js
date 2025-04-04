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
      <aside className="sidebar">
        <CreateForm />
        <UpdateForm />
      </aside>
      <main className="main-content">
        <Notes />
      </main>
    </div>
  );
}
