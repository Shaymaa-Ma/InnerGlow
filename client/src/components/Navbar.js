import React, { useState } from "react";  
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import ReorderIcon from "@mui/icons-material/Reorder";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-left">
        <Link to="/" onClick={closeMenu} className="logo-container">
          <img
            src="http://localhost:5000/images/InnerGlow_Logo.png"
            alt="InnerGlow Logo"
            className="logo-image"
          />
        </Link>
      </div>

      {/* Links */}
      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/about" onClick={closeMenu}>About</Link>
        <Link to="/services" onClick={closeMenu}>Services</Link>
        <Link to="/findtherapist" onClick={closeMenu}>Find Therapist</Link>
        <Link to="/contact" onClick={closeMenu}>Contact</Link>

        {/* Mobile Auth Buttons */}
        {!user && (
          <div className="mobile-auth mobile-only">
            <Link to="/auth" onClick={closeMenu} className="login-btn mobile-btn">Login</Link>
            <Link to="/auth" onClick={closeMenu} className="signup-btn mobile-btn">Signup</Link>
          </div>
        )}
        {user && (
          <button
            className="logout-btn mobile-btn mobile-only"
            onClick={() => { logout(); closeMenu(); }}
          >
            Logout
          </button>
        )}
      </div>

      {/* Desktop Auth Buttons */}
      <div className="navbar-auth desktop-only">
        {user ? (
          <button className="logout-btn" onClick={logout}>Logout</button>
        ) : (
          <>
            <Link to="/auth" className="login-btn">Login/SignUp</Link>
          </>
        )}
      </div>

      {/* Burger Menu */}
      <button className="menu-toggle" onClick={toggleMenu}>
        {menuOpen ? "✖" : <ReorderIcon style={{ fontSize: "32px" }} />}
      </button>
    </nav>
  );
};

export default Navbar;
