import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import NotesPage from "./pages/NotesPage";
import "./styles/styles.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Thay đổi class "dark-mode" trên <body> khi bật/tắt darkMode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      {/* HEADER */}
      <header className="nav-bar">
        <nav>
          <ul className="nav-list">
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            {/* Thêm các link khác (Login, Signup...) nếu cần */}
          </ul>
        </nav>
        <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      {/* MAIN */}
      <main className="app-container">
        <Routes>
          <Route path="/" element={<NotesPage />} />
          {/* Các route khác nếu cần */}
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Notes App</p>
      </footer>
    </BrowserRouter>
  );
}

export default App;
