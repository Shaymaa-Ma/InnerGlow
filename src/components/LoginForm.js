
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      alert("Login successful!");
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <form>
      <h1>Sign In</h1>
      <div className="social-icons">
        <a href="#" className="icon"><i className="fab fa-google-plus-g"></i></a>
        <a href="#" className="icon"><i className="fab fa-facebook-f"></i></a>
        <a href="#" className="icon"><i className="fab fa-github"></i></a>
        <a href="#" className="icon"><i className="fab fa-linkedin-in"></i></a>
      </div>
      <span>or use your email and password</span>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <a href="#">Forgot your password?</a>
      <button type="button" onClick={handleSignIn}>Sign In</button>
    </form>
  );
};

export default LoginForm;
