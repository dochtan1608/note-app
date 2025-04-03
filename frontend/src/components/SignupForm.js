import React from "react";
import { useNavigate } from "react-router-dom";
import authStore from "../stores/authStore";

export default function SignupForm() {
  const store = authStore();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    await store.signup();
    navigate("/login");
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Signup</h2>
      <form onSubmit={handleSignup}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            className="input-field"
            onChange={store.updateSignupForm}
            value={store.signupForm.email}
            type="email"
            name="email"
            placeholder="Email"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            className="input-field"
            onChange={store.updateSignupForm}
            value={store.signupForm.password}
            type="password"
            name="password"
            placeholder="Password"
          />
        </div>
        <button className="btn" type="submit">
          Signup
        </button>
      </form>
    </div>
  );
}
