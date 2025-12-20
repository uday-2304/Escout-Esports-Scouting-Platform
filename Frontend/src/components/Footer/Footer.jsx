import React from "react";
import "./Footer.css";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaDiscord } from "react-icons/fa";
import Img9 from "../../assets/img9.jpg"; // your banner image

const Footer = () => {
  return (
    <footer className="footer">
      {/* Image Banner above footer */}
      <div className="footer-banner">
        <img src={Img9} alt="eSports Banner" />
      </div>

      <div className="footer-container">
        {/* Branding */}
        <div className="footer-brand">
          <h2>eScout</h2>
          <p>Connecting gamers to pro eSports teams worldwide.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Players</a></li>
            <li><a href="#">Scouts</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h3>Join Our Newsletter</h3>
          <p>Get the latest updates on top players and tournaments.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaYoutube /></a>
            <a href="#"><FaDiscord /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 eScout. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
