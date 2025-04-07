import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useReminderStore from "../../stores/reminderStore";
import Portal from "../Portal";

const ShareReminderModal = () => {
  const reminderStore = useReminderStore();
  const modalRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle click outside modal to close
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  const closeModal = () => {
    if (!isSubmitting) {
      reminderStore.toggleShareReminderModal(false);
      // Reset success state after closing
      setTimeout(() => setSuccess(false), 300);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await reminderStore.shareReminder();
      if (result) {
        setSuccess(true);
        // Close modal after 2 seconds
        setTimeout(() => {
          closeModal();
        }, 2000);
      }
    } catch (err) {
      console.error("Error sharing reminder:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [isSubmitting]);

  // Animation variants
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

  // Make sure we render only when modal should be shown
  if (!reminderStore.showShareReminderModal) return null;

  return (
    <Portal>
      <AnimatePresence>
        <motion.div
          key="overlay"
          className="modal-overlay"
          onClick={handleOutsideClick}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
        />
        <motion.div
          key="modal"
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
          {!success ? (
            <>
              <h2>Share Reminder</h2>
              <p className="share-description">
                Share this reminder with another user
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
                  <label htmlFor="email">Recipient's Email*</label>
                  <motion.input
                    type="email"
                    id="email"
                    name="email"
                    value={reminderStore.shareForm.email}
                    onChange={reminderStore.updateShareForm}
                    className="auth-input"
                    placeholder="Enter recipient's email"
                    required
                    disabled={isSubmitting}
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>

                <div className="modal-actions">
                  <motion.button
                    type="button"
                    onClick={closeModal}
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
                        Sharing...
                      </>
                    ) : (
                      "Share Reminder"
                    )}
                  </motion.button>
                </div>
              </form>
            </>
          ) : (
            <div className="share-success">
              <div className="success-icon">✓</div>
              <h3>Reminder Shared!</h3>
              <p>
                The recipient will get a notification to accept your reminder.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Portal>
  );
};

export default ShareReminderModal;
