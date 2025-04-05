import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authStore from "../stores/authStore";

export default function LoginForm() {
  const store = authStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await store.login();
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Welcome Back</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            id="email"
            className="auth-input"
            onChange={store.updateLoginForm}
            value={store.loginForm.email}
            type="email"
            name="email"
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="password-input-container">
            <input
              id="password"
              className="auth-input password-input"
              onChange={store.updateLoginForm}
              value={store.loginForm.password}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🔓" : "🔒"}
            </button>
          </div>
        </div>
        <button className="auth-button" type="submit">
          Sign In
        </button>
      </form>
      <div className="auth-link">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}
