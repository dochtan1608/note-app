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

  return (
    <motion.div
      className="logout-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "2rem",
        textAlign: "center",
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

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        You have been logged out
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Thank you for using our application.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to="/login" className="btn-login-again">
          Log in again
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default LogoutPage;
