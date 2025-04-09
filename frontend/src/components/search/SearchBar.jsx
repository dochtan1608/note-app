import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useSearchStore from "../../stores/searchStore";
import SearchResults from "./SearchResults";
import notesStore from "../../stores/notesStore";

const SearchBar = () => {
  const {
    searchTerm,
    setSearchTerm,
    showResults,
    toggleResults,
    clearSearch,
    searchResults,
    selectedResultIndex,
    navigateResults,
    selectResult,
  } = useSearchStore();

  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        toggleResults(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [toggleResults]);

  const handleKeyDown = (e) => {
    if (showResults && searchResults.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        navigateResults("down");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        navigateResults("up");
      } else if (e.key === "Enter" && selectedResultIndex >= 0) {
        e.preventDefault();
        handleSelectResult(searchResults[selectedResultIndex]);
      } else if (e.key === "Escape") {
        toggleResults(false);
      }
    }
  };

  const handleSelectResult = (result) => {
    if (!result) return;

    clearSearch();

    if (result.type === "note") {
      navigate("/");
      notesStore.getState().toggleUpdate(result.data);
    } else if (result.type === "shared") {
      navigate("/shared");
    } else if (result.type === "reminder") {
      navigate("/reminders");
    }
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <motion.div
          className="search-icon"
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1 }}
        >
          🔍
        </motion.div>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm && toggleResults(true)}
          className="search-input"
          placeholder="Search notes, reminders..."
        />

        {searchTerm && (
          <motion.button
            className="clear-search"
            onClick={clearSearch}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            whileHover={{ opacity: 1, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ✕
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showResults && (
          <SearchResults
            results={searchResults}
            selectedIndex={selectedResultIndex}
            onSelectResult={handleSelectResult}
            onSelectIndex={selectResult}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
