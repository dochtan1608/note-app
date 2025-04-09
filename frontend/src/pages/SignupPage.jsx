import React from "react";
import { motion } from "framer-motion";
import SignupForm from "../components/SignupForm";

const SignupPage = () => {
  return (
    <motion.div
      className="auth-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SignupForm />
    </motion.div>
  );
};

export default SignupPage;
