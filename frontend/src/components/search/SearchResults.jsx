import React from "react";
import { motion } from "framer-motion";

const SearchResults = ({
  results,
  selectedIndex,
  onSelectResult,
  onSelectIndex,
}) => {
  if (!results || results.length === 0) {
    return (
      <motion.div
        className="search-results"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <div className="no-results">No results found</div>
      </motion.div>
    );
  }

  const getIconForType = (type) => {
    switch (type) {
      case "note":
        return "📝";
      case "shared":
        return "🔗";
      case "reminder":
        return "⏰";
      default:
        return "📄";
    }
  };

  return (
    <motion.div
      className="search-results"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="results-header">
        <span className="results-count">{results.length} results</span>
      </div>

      <div className="results-list">
        {results.map((result, index) => (
          <motion.div
            key={result.id}
            className={`result-item ${
              selectedIndex === index ? "selected" : ""
            }`}
            onClick={() => onSelectResult(result)}
            onMouseEnter={() => onSelectIndex(index)}
            whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <div className="result-icon">{getIconForType(result.type)}</div>

            <div className="result-content">
              <div className="result-title">{result.title}</div>
              {result.preview && (
                <div className="result-preview">{result.preview}</div>
              )}
              {result.type === "shared" && result.sharedBy && (
                <div className="result-shared-by">
                  Shared by {result.sharedBy}
                </div>
              )}
            </div>

            <div className="result-type">
              {result.type === "note"
                ? "Note"
                : result.type === "shared"
                ? "Shared"
                : "Reminder"}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchResults;
