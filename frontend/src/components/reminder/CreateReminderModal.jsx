import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useReminderStore from "../../stores/reminderStore";
import Portal from "../Portal";

const CreateReminderModal = () => {
  const reminderStore = useReminderStore();
  const modalRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      reminderStore.toggleCreateModal(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await reminderStore.createReminder();
      reminderStore.toggleCreateModal(false);
    } catch (err) {
      console.error("Error creating reminder:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") reminderStore.toggleCreateModal(false);
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [reminderStore]);

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  if (!reminderStore.showCreateModal) return null;

  return (
    <Portal>
      <AnimatePresence>
        <motion.div
          className="modal-overlay"
          onClick={handleOutsideClick}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
        />
        <motion.div
          className="share-modal reminder-modal"
          ref={modalRef}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            margin: "0",
          }}
        >
          <h2>Create Reminder</h2>
          <p className="share-description">
            Set a reminder to help you remember important tasks
          </p>

          {reminderStore.error && (
            <motion.div
              className="share-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring" }}
            >
              {reminderStore.error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="reminder-form">
            <div className="form-group">
              <label htmlFor="title">Title*</label>
              <motion.input
                type="text"
                id="title"
                name="title"
                value={reminderStore.createForm.title}
                onChange={reminderStore.updateCreateForm}
                className="auth-input"
                placeholder="Enter reminder title"
                required
                disabled={isSubmitting}
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <motion.textarea
                id="description"
                name="description"
                value={reminderStore.createForm.description}
                onChange={reminderStore.updateCreateForm}
                className="auth-input"
                placeholder="Add details about this reminder"
                rows={3}
                disabled={isSubmitting}
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date*</label>
              <motion.input
                type="datetime-local"
                id="dueDate"
                name="dueDate"
                value={reminderStore.createForm.dueDate}
                onChange={reminderStore.updateCreateForm}
                className="auth-input"
                required
                disabled={isSubmitting}
                whileFocus={{ scale: 1.01 }}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <motion.select
                id="priority"
                name="priority"
                value={reminderStore.createForm.priority}
                onChange={reminderStore.updateCreateForm}
                className="auth-input"
                disabled={isSubmitting}
                whileFocus={{ scale: 1.01 }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </motion.select>
            </div>

            <div className="modal-actions">
              <motion.button
                type="button"
                onClick={() => reminderStore.toggleCreateModal(false)}
                className="btn-cancel-modal"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>

              <motion.button
                type="submit"
                className="btn-create"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Creating...
                  </>
                ) : (
                  "Create Reminder"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </Portal>
  );
};

export default CreateReminderModal;
