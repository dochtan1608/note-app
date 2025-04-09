import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NoteCard from "./NoteCard";
import notesStore from "../stores/notesStore";

const Notes = () => {
  const notes = notesStore((state) => state.notes);
  const [filter, setFilter] = useState("all");
  const filteredNotes = notes?.filter((note) => {
    if (filter === "all") return true;
    if (filter === "favorites") return note.isFavorite;
    return true;
  });

  const TabButton = ({ label, value, count }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`tab ${filter === value ? "active" : ""}`}
      onClick={() => setFilter(value)}
    >
      {label} {count !== undefined ? `(${count})` : ""}
    </motion.button>
  );

  return (
    <motion.div
      className="notes-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="notes-header">
        <h2>My Notes {notes?.length > 0 ? `(${notes.length})` : ""}</h2>

        <div className="tabs">
          <TabButton label="All" value="all" count={notes?.length} />
          <TabButton
            label="Favorites"
            value="favorites"
            count={notes?.filter((note) => note.isFavorite).length}
          />
        </div>
      </div>

      <AnimatePresence>
        {filteredNotes && filteredNotes.length > 0 ? (
          <motion.div
            className="notes-grid"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnimatePresence>
              {filteredNotes.map((note) => (
                <NoteCard key={note._id} note={note} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            className="empty-notes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="empty-notes-icon">
              {filter === "all" ? "📝" : "⭐"}
            </div>
            <h3>No {filter !== "all" ? filter : ""} notes found</h3>
            <p>
              {filter === "all"
                ? "Create your first note using the form on the left!"
                : "Mark notes as favorites to see them here"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Notes;
