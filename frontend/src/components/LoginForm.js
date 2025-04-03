import React from "react";
import { useNavigate } from "react-router-dom";
import authStore from "../stores/authStore";

export default function LoginForm() {
  const store = authStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await store.login();
    navigate("/");
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            className="input-field"
            onChange={store.updateLoginForm}
            value={store.loginForm.email}
            type="email"
            name="email"
            placeholder="Email"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            className="input-field"
            onChange={store.updateLoginForm}
            value={store.loginForm.password}
            type="password"
            name="password"
            placeholder="Password"
          />
        </div>
        <button className="btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
