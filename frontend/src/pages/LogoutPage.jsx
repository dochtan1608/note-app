import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import authStore from "../stores/authStore";

const LogoutPage = () => {
  const store = authStore();

  useEffect(() => {
    const performLogout = async () => {
      await store.logout();
    };

    performLogout();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div variants={itemVariants}>
          <h2 className="auth-title">See You Soon!</h2>
        </motion.div>

        <motion.div
          className="logout-content"
          variants={itemVariants}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
            padding: "1rem 0 2rem",
          }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{
              scale: [0.8, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: "4rem" }}
          >
            👋
          </motion.div>

          <motion.p
            style={{
              fontSize: "1.1rem",
              textAlign: "center",
              color: "var(--text-medium)",
              margin: 0,
            }}
          >
            You have been successfully logged out.
            <br />
            Thank you for using Chitan Notes.
          </motion.p>
        </motion.div>

        <motion.button
          className="btn-primary auth-button"
          variants={itemVariants}
          whileHover={{
            scale: 1.03,
            y: -4,
            boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)",
          }}
          whileTap={{ scale: 0.98, y: 0 }}
          style={{ marginTop: "1rem" }}
          onClick={() => (window.location.href = "/login")}
        >
          Log In Again
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LogoutPage;
