import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import authStore from "../stores/authStore";
import {
  SimpleMotion as motion,
  SimpleAnimatePresence as AnimatePresence,
  addFallbackStyles,
} from "./SimpleFallbacks";
import RequireAuth from "./RequireAuth";
import HomePage from "../pages/HomePage";
import NotesPage from "../pages/NotesPage";
import SharedNotesPage from "../pages/SharedNotesPage";
import RemindersPage from "../pages/RemindersPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import LogoutPage from "../pages/LogoutPage";
import NotificationBell from "./reminder/NotificationBell";
import SearchBar from "./search/SearchBar";
import "../styles/styles.css";

addFallbackStyles();

const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="simple-spinner"></div>
    <p>Loading...</p>
  </div>
);

function App() {
  const [darkMode, setDarkMode] = useState(() => {
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
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <header className="nav-bar">
        <nav className="nav-content">
          <Link to={isLoggedIn ? "/" : "/home"} className="nav-link">
            <div className="logo-container">
              {!isLoggedIn && <span className="logo-text">Chitan Notes</span>}
            </div>
          </Link>

          <div className="nav-list">
            {isLoggedIn && (
              <>
                <Link
                  to="/"
                  className={`nav-link ${isActive("/") ? "active" : ""}`}
                >
                  My Notes
                </Link>
                <Link
                  to="/shared"
                  className={`nav-link ${isActive("/shared") ? "active" : ""}`}
                >
                  Shared
                </Link>
                <Link
                  to="/reminders"
                  className={`nav-link ${
                    isActive("/reminders") ? "active" : ""
                  }`}
                >
                  Reminders
                </Link>
              </>
            )}
          </div>

          <div className="nav-actions">
            {isLoggedIn && <SearchBar />}

            {isLoggedIn && <NotificationBell />}

            <div className="auth-links">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className={`nav-link ${isActive("/login") ? "active" : ""}`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className={`nav-link ${
                      isActive("/signup") ? "active" : ""
                    }`}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <Link
                  to="/logout"
                  className={`nav-link ${isActive("/logout") ? "active" : ""}`}
                >
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
              <Route path="/home" element={<HomePage />} />
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
              <Route
                path="/reminders"
                element={
                  <RequireAuth>
                    <RemindersPage />
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
