import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import App from "./components/App";

// Configure axios
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

// Add response interceptor for debugging
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Axios Error:", error);
    return Promise.reject(error);
  }
);

// Print a message to help users understand what's happening
console.log(
  "%cNote App Running with Fallbacks",
  "color: blue; font-size: 16px; font-weight: bold;"
);
console.log(
  "%cSome external dependencies couldn't be loaded. The app is running with simplified components.",
  "color: orange; font-size: 14px;"
);
console.log(
  "%cTo install missing dependencies run: npm install framer-motion date-fns",
  "color: green; font-size: 14px;"
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
