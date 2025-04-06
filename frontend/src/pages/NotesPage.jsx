import React, { useEffect, useState } from "react";
import notesStore from "../stores/notesStore";
import Notes from "../components/Notes";
import UpdateForm from "../components/UpdateForm";
import CreateForm from "../components/CreateForm";
import LoadingSpinner from "../components/LoadingSpinner";

const NotesPage = () => {
  const store = notesStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      setIsLoading(true);
      try {
        await store.fetchNotes();
      } catch (error) {
        console.error("Error loading notes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadNotes();
  }, []);

  return (
    <div className="notes-page">
      <div className="sidebar">
        <CreateForm />
        <UpdateForm />
      </div>
      <div className="main-content">
        {isLoading ? (
          <div className="loading-container">
            <LoadingSpinner />
          </div>
        ) : (
          <Notes />
        )}
      </div>
    </div>
  );
};

export default NotesPage;
