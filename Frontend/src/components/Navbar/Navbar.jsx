import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBars,
  faTimes,
  faBell,
  faSignOutAlt,
  faIdCard,
  faGamepad
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // 🧠 Auth Listener: Updates UI when login state changes
  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("authChanged", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // 🧠 Click Outside Handler: Closes dropdown when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🚪 Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    // Dispatch event so other components know auth state changed
    window.dispatchEvent(new Event("authChanged"));
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header>
      <div className="navbar">
        
        {/* LOGO - Matches the Hero aesthetic */}
        <div className="logo" onClick={() => navigate('/')}>
          eSC<span>Ø</span>Ut
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </div>

        {/* NAVIGATION LINKS */}
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" className="nav-item" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          {/* TOURNAMENTS LINK */}
          <NavLink to="/tournaments" className="nav-item" onClick={() => setMenuOpen(false)}>
            Tournaments
          </NavLink>
          <NavLink to="/arena-hub" className="nav-item" onClick={() => setMenuOpen(false)}>
            Arena Hub
          </NavLink>
          <NavLink to="/dashboard" className="nav-item" onClick={() => setMenuOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink to="/rankings" className="nav-item" onClick={() => setMenuOpen(false)}>
           Rankings
         </NavLink>
          <NavLink to="/about" className="nav-item" onClick={() => setMenuOpen(false)}>
            About
          </NavLink>
          <NavLink to="/contact" className="nav-item" onClick={() => setMenuOpen(false)}>
            Contact
          </NavLink>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="nav-actions">
          
          {/* Notification Bell */}
          <NavLink to="/messages" className="notification">
            <FontAwesomeIcon icon={faBell} />
            {/* Notification Badge */}
            <span className="notif-count">5</span>
          </NavLink>

          {/* Profile Dropdown */}
          <div className="profile" ref={dropdownRef}>
            <FontAwesomeIcon
              icon={faUser}
              className="profile-icon"
              onClick={() => setDropdownOpen((prev) => !prev)}
            />

            {dropdownOpen && (
              <div className="profile-dropdown">
                
                {/* Profile Link */}
                <NavLink
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FontAwesomeIcon icon={faIdCard} /> Profile
                </NavLink>

                {/* Conditional Login/Logout */}
                {isLoggedIn ? (
                  <button
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                  </button>
                ) : (
                  <NavLink
                    to="/login"
                    className="dropdown-item"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/login");
                    }}
                  >
                    <FontAwesomeIcon icon={faGamepad} /> Login
                  </NavLink>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;