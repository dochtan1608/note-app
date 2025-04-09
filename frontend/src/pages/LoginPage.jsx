import React from "react";
import { motion } from "framer-motion";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <motion.div
      className="auth-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LoginForm />
    </motion.div>
  );
};

export default LoginPage;
