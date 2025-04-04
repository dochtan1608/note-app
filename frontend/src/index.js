import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.js";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
