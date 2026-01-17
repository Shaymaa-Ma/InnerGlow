import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaGooglePlusG, FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);

    if (result.success) {
      navigate("/book-appointment"); // redirect after login
    } else {
      setError(result.message);
    }
  };

  return (
    <form onSubmit={handleSignIn}>
      <h1>Sign In</h1>

      <div className="social-icons">
        <a href="#" className="icon" onClick={(e) => e.preventDefault()}>
          <FaGooglePlusG />
        </a>
        <a href="#" className="icon" onClick={(e) => e.preventDefault()}>
          <FaFacebookF />
        </a>
        <a href="#" className="icon" onClick={(e) => e.preventDefault()}>
          <FaGithub />
        </a>
        <a href="#" className="icon" onClick={(e) => e.preventDefault()}>
          <FaLinkedinIn />
        </a>
      </div>


      <span>or use your email and password</span>

      {error && <p style={{ color: "red" }}>{error}</p>}

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

      <a href="#" onClick={(e) => { e.preventDefault(); navigate("/forgot-password"); }}>
        Forgot your password?
      </a>


      <button type="submit">Sign In</button>
    </form>
  );
};

export default LoginForm;
