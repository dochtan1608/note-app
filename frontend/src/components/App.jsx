import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import NotesPage from "../pages/NotesPage";
import RequireAuth from "./RequireAuth";
import SignupPage from "../pages/SignupPage";
import LogoutPage from "../pages/LogoutPage";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <div className="App">
      <div className="container">
        <BrowserRouter>
          <nav>
            <ul>
              <li>
                <Link
                  to="/"
                  style={{
                    padding: "10px 20px",
                    borderRadius: "20px",
                    background: "rgba(44, 82, 130, 0.8)",
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  Home
                </Link>
              </li>
            </ul>
            {/* Thay h1 thành nút toggle theme */}
            <div className="theme-toggle-btn" onClick={toggleTheme}>
              My Notes
            </div>
            <ul>
              <li>
                <Link
                  to="/login"
                  style={{
                    padding: "10px 20px",
                    borderRadius: "20px",
                    background: "rgba(44, 82, 130, 0.8)",
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  style={{
                    padding: "10px 20px",
                    borderRadius: "20px",
                    background: "rgba(44, 82, 130, 0.8)",
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  Signup
                </Link>
              </li>
              <li>
                <Link
                  to="/logout"
                  style={{
                    padding: "10px 20px",
                    borderRadius: "20px",
                    background: "rgba(44, 82, 130, 0.8)",
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  Logout
                </Link>
              </li>
            </ul>
          </nav>
          <div>
            <Routes>
              <Route
                index
                element={
                  <RequireAuth>
                    <NotesPage />
                  </RequireAuth>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/logout" element={<LogoutPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
