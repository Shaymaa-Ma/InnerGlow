import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const SignupForm = ({ onSignupSuccess }) => {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await signup(name, email, password);

    setLoading(false);

    if (result.success) {
      alert("Signup successful! Please login.");
      if (onSignupSuccess) onSignupSuccess(); // switch to login panel
    } else {
      alert(result.message);
    }
  };

  return (
    <form>
      <h1>Create Account</h1>

      <div className="social-icons">
        <a href="#" className="icon" onClick={(e) => e.preventDefault()}>
          <i className="fab fa-google-plus-g"></i>
        </a>
        <a href="#" className="icon" onClick={(e) => e.preventDefault()}>
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="#" className="icon" onClick={(e) => e.preventDefault()}>
          <i className="fab fa-github"></i>
        </a>
        <a href="#" className="icon" onClick={(e) => e.preventDefault()}>
          <i className="fab fa-linkedin-in"></i>
        </a>
      </div>

      <span>or use your email for registration</span>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="button" onClick={handleSignUp} disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignupForm;
