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
        <h2 className="auth-title">Welcome Back</h2>
      </motion.div>

      {loginError && (
        <motion.div
          className="auth-error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          {loginError}
        </motion.div>
      )}

      <motion.form
        onSubmit={handleLogin}
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
            onChange={store.updateLoginForm}
            value={store.loginForm.email}
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            disabled={isLoggingIn}
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
              onChange={store.updateLoginForm}
              value={store.loginForm.password}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              required
              disabled={isLoggingIn}
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
          className="auth-button"
          type="submit"
          disabled={isLoggingIn}
          variants={itemVariants}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 8px 15px rgba(37, 99, 235, 0.25)",
          }}
          whileTap={{ scale: 0.98 }}
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

      <motion.div className="auth-link" variants={itemVariants}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;
