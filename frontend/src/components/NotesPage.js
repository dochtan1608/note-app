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
    <div className="content-layout">
      <section className="notes-section">
        <Notes />
        <UpdateForm />
      </section>
      <section className="create-form-section">
        <CreateForm />
      </section>
    </div>
  );
}
