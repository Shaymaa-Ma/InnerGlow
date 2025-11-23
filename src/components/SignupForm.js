// components/SignupForm.js
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const SignupForm = () => {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();
    if (signup(name, email, password)) {
      alert("Signup successful!");
      window.location.href = "/services";
    } else {
      alert("Please fill all fields correctly.");
    }
  };

  return (
    <form>
      <h1>Create Account</h1>
      <div className="social-icons">
        <a href="#" className="icon"><i className="fab fa-google-plus-g"></i></a>
        <a href="#" className="icon"><i className="fab fa-facebook-f"></i></a>
        <a href="#" className="icon"><i className="fab fa-github"></i></a>
        <a href="#" className="icon"><i className="fab fa-linkedin-in"></i></a>
      </div>
      <span>or use your email for registration</span>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="button" onClick={handleSignUp}>Sign Up</button>
    </form>
  );
};

export default SignupForm;
