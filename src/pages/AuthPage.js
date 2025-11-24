
import React, { useState } from "react";
import "../styles/AuthPage.css";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

const AuthPage = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-body">
        <div className={`auth-container ${isActive ? "active" : ""}`}>

          <div className="form-container sign-in">
            <LoginForm />
          </div>

          <div className="form-container sign-up">
            <SignupForm />
          </div>

          {/* TOGGLE AREA */}
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

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
