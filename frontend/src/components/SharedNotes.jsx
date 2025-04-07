import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import notesStore from "../stores/notesStore";
import SharedNoteCard from "./SharedNoteCard";
import LoadingSpinner from "./LoadingSpinner";

const SharedNotes = () => {
  const { sharedNotes } = notesStore((state) => ({
    sharedNotes: state.sharedNotes,
  }));

  // Group shared notes by sender email
  const groupedSharedNotes = React.useMemo(() => {
    if (!sharedNotes || sharedNotes.length === 0) return {};

    return sharedNotes.reduce((acc, shared) => {
      const email = shared.sharedBy?.email;
      if (!email) return acc;

      if (!acc[email]) {
        acc[email] = [];
      }
      acc[email].push(shared);
      return acc;
    }, {});
  }, [sharedNotes]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className="shared-notes-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="shared-notes-header">
        <h2>Shared With Me</h2>
        <div className="shared-header-actions">
          <div className="shared-count">{sharedNotes?.length || 0} notes</div>
          {/* Removed the refresh button */}
        </div>
      </div>

      <AnimatePresence>
        {!sharedNotes ? (
          <LoadingSpinner />
        ) : sharedNotes.length > 0 ? (
          <>
            {Object.entries(groupedSharedNotes).map(([email, notes]) => (
              <motion.div
                className="shared-notes-group"
                key={email}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="shared-group-title">From: {email}</h3>
                <div className="shared-notes-grid">
                  <AnimatePresence>
                    {notes.map((sharedNote) => (
                      <SharedNoteCard
                        key={sharedNote._id}
                        sharedNote={sharedNote}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </>
        ) : (
          <motion.div
            className="empty-shared-notes"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="empty-icon"
              animate={{
                rotate: [0, 10, -10, 10, 0],
                y: [0, -5, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              📩
            </motion.div>
            <p>No shared notes found</p>
            <span className="empty-message">
              When someone shares a note with you, it will appear here.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SharedNotes;
