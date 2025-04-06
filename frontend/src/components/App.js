import LoginPage from "../pages/LoginPage";
import NotesPage from "../pages/NotesPage";
import SharedNotesPage from "../pages/SharedNotesPage";
import { Routes, Route, Link } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import SignupPage from "../pages/SignupPage";
import LogoutPage from "../pages/LogoutPage";
import "../styles/styles.css";
import { useState, useEffect } from "react";
import authStore from "../stores/authStore"; // Add this import

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const isLoggedIn = authStore((state) => state.loggedIn); // Get login state once

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
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
              📒 Notes
            </Link>
            {isLoggedIn && (
              <Link to="/shared" className="nav-link">
                🔗 Shared
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
        <Routes>
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
      </main>
    </>
  );
}

export default App;
