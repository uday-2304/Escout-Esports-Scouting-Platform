import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faBars,
  faTimes,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  // 🧠 Update login status whenever token changes
  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    // Listen for changes from any component (like login/logout)
    window.addEventListener("authChanged", handleAuthChange);

    // Also check when localStorage changes (e.g., in another tab)
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // 🧠 Close dropdowns if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        notifRef.current &&
        !notifRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
        setNotifOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🚪 Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChanged")); // notify others
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header>
      <div className="navbar">
        <div className="logo">eSCØUt</div>

        {/* Menu Button */}
        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </div>

        {/* Navigation Links */}
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" className="nav-item" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink
            to="/arena-hub"
            className="nav-item"
            onClick={() => setMenuOpen(false)}
          >
            Arena Hub
          </NavLink>
          <NavLink to="/dashboard" className="nav-item" onClick={() => setMenuOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink to="/about" className="nav-item" onClick={() => setMenuOpen(false)}>
            About
          </NavLink>
          <NavLink to="/contact" className="nav-item" onClick={() => setMenuOpen(false)}>
            Contact
          </NavLink>
        </nav>

        {/* Right Side Icons */}
        <div className="nav-actions">
          {/* Search box (Desktop) */}
          <div className="search-box desktop-search">
            <input type="text" placeholder="Search products..." />
            <FontAwesomeIcon icon={faSearch} className="icon" />
          </div>

          {/* Search Icon for Mobile */}
          <div className="mobile-search" ref={searchRef}>
            <FontAwesomeIcon
              icon={faSearch}
              className="icon"
              onClick={() => setSearchOpen((prev) => !prev)}
            />
            {searchOpen && (
              <div className="search-dropdown">
                <input type="text" placeholder="Search site..." autoFocus />
              </div>
            )}
          </div>

          {/* Notification Icon */}
          <NavLink to="/messages" className="notification" ref={notifRef}>
            <FontAwesomeIcon icon={faBell} className="icon" />
            <span className="notif-count">5</span>
          </NavLink>

          {/* 🧍 Profile Dropdown */}
          <div className="profile" ref={dropdownRef}>
            <FontAwesomeIcon
              icon={faUser}
              className="icon profile-icon"
              onClick={() => setDropdownOpen((prev) => !prev)}
            />

            {dropdownOpen && (
              <div className="profile-dropdown">
                <NavLink
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </NavLink>

                {/* 🔐 Dynamic Login / Logout button */}
                {isLoggedIn ? (
                  <button
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
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
                    Login
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
