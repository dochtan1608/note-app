import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Organize your thoughts with Chitan Notes
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            This is a demo version. Some features may not be fully functional.
            Please DON'T USE DARK MODE FOR A BETTER EXPERIENCE because I haven't
            finished it yet.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link to="/login" className="btn-primary">
              Sign In
            </Link>
            <Link to="/signup" className="btn-secondary">
              Create Account
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="hero-image"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="app-preview">
            <div className="preview-note">
              <h3>Project Ideas</h3>
              <p>1. Create a new landing page</p>
              <p>2. Improve search functionality</p>
              <p>3. Add dark mode to the app</p>
            </div>
            <div className="preview-note important">
              <h3>Meeting Notes</h3>
              <p>Discuss project timeline with team</p>
              <p>Review quarterly goals</p>
            </div>
            <div className="preview-note reminder">
              <h3>Don't Forget</h3>
              <p>Call dentist for appointment</p>
              <p>Buy groceries</p>
            </div>
          </div>
        </motion.div>
      </section>

      <motion.footer
        className="home-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="footer-content">
          <p className="footer-love">
            Made with <span className="heart">❤️</span> by{" "}
            <a
              href="https://github.com/dochtan1608"
              target="_blank"
              rel="noopener noreferrer"
              className="author-link"
            >
              this guy
            </a>
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default HomePage;
