import React from "react";

// Simple LoadingSpinner without framer-motion
export const SimpleLoadingSpinner = () => (
  <div className="loading-container">
    <div className="simple-spinner"></div>
    <p>Loading...</p>
  </div>
);

export const SimpleMotion = ({ children, className, style = {}, ...props }) => {
  const eventHandlers = {};
  Object.keys(props).forEach((key) => {
    if (key.startsWith("on")) {
      eventHandlers[key] = props[key];
    }
  });
  const extractedStyle = { ...style };
  if (props.variants && props.animate) {
    const animateVariant = props.variants[props.animate];
    if (animateVariant) {
      Object.assign(extractedStyle, animateVariant);
    }
  }

  return (
    <div className={className} style={extractedStyle} {...eventHandlers}>
      {children}
    </div>
  );
};
export const SimpleAnimatePresence = ({ children }) => {
  return <>{children}</>;
};
export const simpleFormatDistanceToNow = (date) => {
  if (!date) return "";

  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.round(diffMs / 60000);
  const diffHrs = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs !== 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const d = new Date(date);
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};
export const simpleFormat = (date, formatString) => {
  const d = new Date(date);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;

  return `${month} ${day}, ${year} at ${hour12}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;
};

// date-fns
export const format = simpleFormat;
export const formatDistanceToNow = simpleFormatDistanceToNow;

export const addFallbackStyles = () => {
  if (document.getElementById("fallback-styles")) return;

  const style = document.createElement("style");
  style.id = "fallback-styles";
  style.textContent = `
    .simple-spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border-left-color: #3b82f6;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    body.dark-mode .simple-spinner {
      border-color: rgba(255, 255, 255, 0.1);
      border-left-color: #60a5fa;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      min-height: 200px;
    }
    
    .nav-icon:hover {
      transform: scale(1.05);
    }
    
    .nav-icon:active {
      transform: scale(0.95);
    }
    
    .auth-loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
    }
  `;
  document.head.appendChild(style);
};
