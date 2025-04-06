import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import authStore from "../stores/authStore";
import {
  SimpleMotion as motion,
  SimpleAnimatePresence as AnimatePresence,
  addFallbackStyles,
} from "./SimpleFallbacks";
import RequireAuth from "./RequireAuth";
import NotesPage from "../pages/NotesPage";
import SharedNotesPage from "../pages/SharedNotesPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import LogoutPage from "../pages/LogoutPage";
import "../styles/styles.css";

// Run this once to add the fallback styles to the document
addFallbackStyles();

// Local LoadingSpinner implementation that doesn't depend on framer-motion
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="simple-spinner"></div>
    <p>Loading...</p>
  </div>
);

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for user preference
    return localStorage.getItem("darkMode") === "true";
  });
  const isLoggedIn = authStore((state) => state.loggedIn);
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    // Save preference to localStorage
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <header className="nav-bar">
        <nav className="nav-content">
          <div className="nav-list">
            <Link to="/" className="nav-link">
              <div className="nav-icon">📒 Notes</div>
            </Link>
            {isLoggedIn && (
              <Link to="/shared" className="nav-link">
                <div className="nav-icon">🔗 Shared</div>
              </Link>
            )}
          </div>

          <div className="nav-actions">
            <div className="auth-links">
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="nav-link">
                    Sign In
                  </Link>
                  <Link to="/signup" className="nav-link">
                    Sign Up
                  </Link>
                </>
              ) : (
                <Link to="/logout" className="nav-link">
                  Sign Out
                </Link>
              )}
            </div>
            <button
              className="dark-mode-toggle"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </nav>
      </header>

      <main className="app-container">
        <div className="page-container">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes location={location}>
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <NotesPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/shared"
                element={
                  <RequireAuth>
                    <SharedNotesPage />
                  </RequireAuth>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/logout" element={<LogoutPage />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </>
  );
}

export default App;
