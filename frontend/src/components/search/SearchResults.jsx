import React from "react";
import { motion } from "framer-motion";

const SearchResults = ({
  results,
  selectedIndex,
  onSelectResult,
  onSelectIndex,
}) => {
  // Get icon based on result type
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

  // Get highlight color based on result type
  const getColorForType = (type) => {
    switch (type) {
      case "note":
        return "var(--primary-color)";
      case "shared":
        return "var(--info-color)";
      case "reminder":
        return "var(--warning-color)";
      default:
        return "var(--text-medium)";
    }
  };

  // Format the label based on result type
  const getTypeLabel = (type) => {
    switch (type) {
      case "note":
        return "Note";
      case "shared":
        return "Shared";
      case "reminder":
        return "Reminder";
      default:
        return type;
    }
  };

  return (
    <motion.div
      className="search-results"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {results.length === 0 ? (
        <div className="no-results">
          <p>No results found</p>
        </div>
      ) : (
        <>
          <div className="results-header">
            <span className="results-count">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="results-list">
            {results.map((result, index) => (
              <motion.div
                key={`${result.type}-${result.id}`}
                className={`result-item ${
                  selectedIndex === index ? "selected" : ""
                }`}
                onClick={() => onSelectResult(result)}
                onMouseEnter={() => onSelectIndex(index)}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <div className="result-icon">{getIconForType(result.type)}</div>
                <div className="result-content">
                  <div className="result-title">
                    {result.title || "Untitled"}
                  </div>
                  <div className="result-preview">{result.preview}</div>
                  {result.type === "shared" && (
                    <div className="result-shared-by">
                      Shared by: {result.sharedBy}
                    </div>
                  )}
                </div>
                <div
                  className="result-type"
                  style={{ color: getColorForType(result.type) }}
                >
                  {getTypeLabel(result.type)}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default SearchResults;
