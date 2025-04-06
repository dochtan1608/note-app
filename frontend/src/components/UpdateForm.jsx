import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import notesStore from "../stores/notesStore";

const UpdateForm = () => {
  const store = notesStore((state) => ({
    updateForm: state.updateForm,
    handleUpdateFieldChange: state.handleUpdateFieldChange,
    updateNote: state.updateNote,
    toggleUpdate: state.toggleUpdate,
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only render if we have an _id in updateForm
  if (!store.updateForm._id) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await store.updateNote(e);
    } catch (err) {
      console.error("Error updating note:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="update-form-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="update-form-header">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Update Note
          </motion.h2>
          <motion.button
            className="btn-cancel"
            onClick={() =>
              store.toggleUpdate({ _id: null, title: "", body: "" })
            }
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.input
            className="input-field"
            onChange={store.handleUpdateFieldChange}
            value={store.updateForm.title}
            name="title"
            placeholder="Title"
            whileFocus={{
              scale: 1.01,
              boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.1)",
            }}
          />

          <motion.textarea
            className="input-field"
            onChange={store.handleUpdateFieldChange}
            value={store.updateForm.body}
            name="body"
            placeholder="Body"
            rows="5"
            whileFocus={{
              scale: 1.01,
              boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.1)",
            }}
          />

          <motion.button
            className="btn-update-submit"
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdateForm;
