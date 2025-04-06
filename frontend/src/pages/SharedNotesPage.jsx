import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import notesStore from "../stores/notesStore";
import SharedNotes from "../components/SharedNotes";
import LoadingSpinner from "../components/LoadingSpinner";

const SharedNotesPage = () => {
  const store = notesStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSharedNotes = async () => {
      setIsLoading(true);
      try {
        await store.fetchSharedNotes();
      } catch (error) {
        console.error("Error loading shared notes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedNotes();
  }, []);

  return (
    <motion.div
      className="shared-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="shared-page-container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>Shared Notes</h1>
          <p className="page-description">
            Access and manage notes that others have shared with you
          </p>
        </motion.div>

        {isLoading ? (
          <div className="loading-container">
            <LoadingSpinner />
          </div>
        ) : (
          <SharedNotes />
        )}
      </div>
    </motion.div>
  );
};

export default SharedNotesPage;
