import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import notesStore from "../stores/notesStore";
import Portal from "./Portal";

const ShareModal = ({ note, onClose }) => {
  const store = notesStore();
  const [email, setEmail] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [error, setError] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      const emailInput = document.getElementById("share-email-input");
      if (emailInput) emailInput.focus();
    }, 100);
    const handleEscKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [onClose]);

  const handleShare = async (e) => {
    e.preventDefault();
    setError("");
    setIsSharing(true);

    try {
      await store.shareNote(note._id, email, {
        read: true,
        write: canEdit,
      });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000); // Close modal after 2 seconds
    } catch (err) {
      setError(err.response?.data?.error || "Failed to share note");
    } finally {
      setIsSharing(false);
    }
  };
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
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
      transition: {
        duration: 0.2,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

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
          className="share-modal"
          ref={modalRef}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          {isSuccess ? (
            <motion.div
              className="share-success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="success-icon">✓</div>
              <h3>Note Shared Successfully!</h3>
              <p>The note has been shared with {email}</p>
            </motion.div>
          ) : (
            <>
              <h2>Share Note</h2>
              <p className="share-description">
                Share this note with others by entering their email address
              </p>

              {error && (
                <motion.div
                  className="share-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring" }}
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleShare} className="share-form">
                <div className="form-group">
                  <label htmlFor="share-email-input">Email Address</label>
                  <motion.input
                    type="email"
                    id="share-email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                    placeholder="Enter email address"
                    required
                    disabled={isSharing}
                    whileFocus={{ scale: 1.01 }}
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={canEdit}
                      onChange={(e) => setCanEdit(e.target.checked)}
                      disabled={isSharing}
                    />
                    Allow editing
                  </label>
                  <span className="permission-hint">
                    {canEdit
                      ? "User can view and edit this note"
                      : "User can only view this note"}
                  </span>
                </div>

                <div className="modal-actions">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="btn-cancel-modal"
                    disabled={isSharing}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    type="submit"
                    className="btn-create"
                    disabled={isSharing}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSharing ? (
                      <>
                        <span className="spinner"></span>
                        Sharing...
                      </>
                    ) : (
                      "Share Note"
                    )}
                  </motion.button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </Portal>
  );
};

export default ShareModal;
