import React, { useEffect } from "react";
import CreateForm from "./CreateForm";
import Notes from "./Notes";
import UpdateForm from "./UpdateForm";
import notesStore from "../stores/notesStore";

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
  }, [store]);

  return (
    <div className="notes-page">
      <div className="sidebar">
        <CreateForm />
      </div>
      <div className="main-content">
        <Notes notes={store.notes} />
        {store.updateForm._id && <UpdateForm />}
      </div>
    </div>
  );
}
