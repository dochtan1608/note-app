import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import authStore from "../stores/authStore";

const SignupForm = () => {
  const store = authStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupError, setSignupError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");
    setIsSigningUp(true);

    try {
      await store.signup();
      // Show success message and navigate
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err);
      setSignupError(
        err.response?.data?.error ||
          "Failed to create account. Please try again."
      );
    } finally {
      setIsSigningUp(false);
    }
  };

  // Animation variants
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
    <motion.div
      className="auth-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={itemVariants}>
        <h2 className="auth-title">Create Account</h2>
      </motion.div>

      {signupError && (
        <motion.div
          className="auth-error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          {signupError}
        </motion.div>
      )}

      <motion.form
        onSubmit={handleSignup}
        className="auth-form"
        variants={itemVariants}
      >
        <motion.div className="form-group" variants={itemVariants}>
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <motion.input
            id="email"
            className="auth-input"
            onChange={store.updateSignupForm}
            value={store.signupForm.email}
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            disabled={isSigningUp}
            whileFocus={{
              scale: 1.01,
              boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.15)",
            }}
            transition={{ type: "spring", stiffness: 400 }}
          />
        </motion.div>

        <motion.div className="form-group" variants={itemVariants}>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="password-input-container">
            <motion.input
              id="password"
              className="auth-input password-input"
              onChange={store.updateSignupForm}
              value={store.signupForm.password}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Choose a password"
              required
              disabled={isSigningUp}
              whileFocus={{
                scale: 1.01,
                boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.15)",
              }}
              transition={{ type: "spring", stiffness: 400 }}
            />
            <motion.button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(0, 0, 0, 0.08)",
              }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? "🔓" : "🔒"}
            </motion.button>
          </div>
        </motion.div>

        <motion.button
          className="btn-primary auth-button"
          type="submit"
          disabled={isSigningUp}
          variants={itemVariants}
          whileHover={{
            backgroundColor: "var(--primary-color-light)",
          }}
        >
          {isSigningUp ? (
            <>
              <span className="spinner"></span>
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </motion.button>
      </motion.form>

      <motion.div className="auth-link" variants={itemVariants}>
        Already have an account? <Link to="/login">Sign In</Link>
      </motion.div>
    </motion.div>
  );
};

export default SignupForm;
