import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import authStore from "../stores/authStore";

const LoginForm = () => {
  const store = authStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      await store.login();
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setLoginError("Invalid email or password. Please try again.");
    } finally {
      setIsLoggingIn(false);
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
        Welcome Back
      </motion.h2>

      {loginError && (
        <motion.div
          className="auth-error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {loginError}
        </motion.div>
      )}

      <motion.form
        onSubmit={handleLogin}
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
            onChange={store.updateLoginForm}
            value={store.loginForm.email}
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            disabled={isLoggingIn}
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
              onChange={store.updateLoginForm}
              value={store.loginForm.password}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              required
              disabled={isLoggingIn}
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
          disabled={isLoggingIn}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isLoggingIn ? (
            <>
              <span className="spinner"></span>
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </motion.button>
      </motion.form>

      <motion.div
        className="auth-link"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;
