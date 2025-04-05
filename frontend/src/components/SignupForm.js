import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authStore from "../stores/authStore";

export default function SignupForm() {
  const store = authStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await store.signup();
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Create Account</h2>
      <form onSubmit={handleSignup} className="auth-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            id="email"
            className="auth-input"
            onChange={store.updateSignupForm}
            value={store.signupForm.email}
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
              onChange={store.updateSignupForm}
              value={store.signupForm.password}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Choose a password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>
        <button className="auth-button" type="submit">
          Create Account
        </button>
      </form>
      <div className="auth-link">
        Already have an account? <Link to="/login">Sign In</Link>
      </div>
    </div>
  );
}
