import React, { useState, useEffect } from "react";
import "../styles/AuthPage.css";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isActive, setIsActive] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if logged in
  useEffect(() => {
    if (user) navigate("/book-appointment");
  }, [user, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-body">
        <div className={`auth-container ${isActive ? "active" : ""}`}>
          {user ? (
            <div className="logged-in-message" style={{ textAlign: "center", padding: "50px" }}>
              <h2>Welcome, {user.name || user.email}!</h2>
              <button onClick={logout}>Logout</button>
            </div>
          ) : (
            <>
              <div className="form-container sign-in">
                <LoginForm />
              </div>

              <div className="form-container sign-up">
                <SignupForm onSignupSuccess={() => setIsActive(false)} />
              </div>

              <div className="toggle-container">
                <div className="toggle">
                  <div className="toggle-panel toggle-left">
                    <h1>Welcome Back!</h1>
                    <p>Enter your personal details to use all our site features</p>
                    <button className="hidden" onClick={() => setIsActive(false)}>Sign In</button>
                  </div>
                  <div className="toggle-panel toggle-right">
                    <h1>Hello, Friend!</h1>
                    <p>Register with your personal details to use all our site features</p>
                    <button className="hidden" onClick={() => setIsActive(true)}>Sign Up</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
