import React, { useState } from "react"; 
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import ReorderIcon from "@mui/icons-material/Reorder";
import logoImg from "../assets/InnerGlow_Logo.png"; 
import { useAuth } from "../context/AuthContext"; // <-- import auth

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const { user, logout } = useAuth(); // <-- get user + logout

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-left">
        <Link to="/" onClick={closeMenu} className="logo-container">
          <img src={logoImg} alt="InnerGlow Logo" className="logo-image" />
        </Link>
      </div>

      {/* Links */}
      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/about" onClick={closeMenu}>About</Link>
        <Link to="/services" onClick={closeMenu}>Services</Link>
        <Link to="/FindTherapist" onClick={closeMenu}>FindTherapist</Link>
        <Link to="/contact" onClick={closeMenu}>Contact</Link>
      </div>

      {/* Auth buttons */}
      <div className={`navbar-auth ${menuOpen ? "hidden" : ""}`}>
        {user ? (
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/auth" className="login-btn">Login</Link>
            <Link to="/auth" className="signup-btn">Signup</Link>
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
