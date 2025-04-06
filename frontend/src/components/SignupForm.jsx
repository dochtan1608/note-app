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

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h2
        className="auth-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Create Account
      </motion.h2>

      {signupError && (
        <motion.div
          className="auth-error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {signupError}
        </motion.div>
      )}

      <motion.form
        onSubmit={handleSignup}
        className="auth-form"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="form-group">
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
            whileFocus={{ scale: 1.01 }}
          />
        </div>

        <div className="form-group">
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
              whileFocus={{ scale: 1.01 }}
            />
            <motion.button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? "🔓" : "🔒"}
            </motion.button>
          </div>
        </div>

        <motion.button
          className="auth-button"
          type="submit"
          disabled={isSigningUp}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
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

      <motion.div
        className="auth-link"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Already have an account? <Link to="/login">Sign In</Link>
      </motion.div>
    </motion.div>
  );
};

export default SignupForm;
