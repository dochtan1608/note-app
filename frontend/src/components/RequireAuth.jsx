import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import authStore from "../stores/authStore";
import LoadingSpinner from "./LoadingSpinner";

const RequireAuth = ({ children }) => {
  const store = authStore();

  useEffect(() => {
    if (store.loggedIn === null) {
      store.checkAuth();
    }
  }, []);

  if (store.loggedIn === null) {
    return (
      <div className="auth-loading-container">
        <LoadingSpinner />
        <p>Verifying authentication...</p>
      </div>
    );
  }

  if (store.loggedIn === false) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default RequireAuth;
