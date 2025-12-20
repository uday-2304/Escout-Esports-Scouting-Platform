import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import api from "../api/Axios"; 

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(location.pathname === "/login");
  const [showForgotModal, setShowForgotModal] = useState(false);

  // form fields
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location.pathname]);

  const handleSwitch = () => {
    const newPath = isLogin ? "/register" : "/login";
    navigate(newPath);
  };

  // ==== Social login (demo only) ====
  const handleGoogleLogin = () => window.open("https://accounts.google.com/signin", "_blank");
  const handleFacebookLogin = () => window.open("https://www.facebook.com/login", "_blank");
  const handleTwitterLogin = () => window.open("https://x.com/i/flow/login", "_blank");

  // ==== Forgot Password ====
  const handleForgotPassword = (e) => {
    e.preventDefault();
    setShowForgotModal(true);
  };

  const handleCloseModal = () => {
    setShowForgotModal(false);
    setForgotEmail("");
  };

  const handleConfirmEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/request-password-reset", { email: forgotEmail });
      alert(res.data.message || `OTP sent to: ${forgotEmail}`);
      setShowForgotModal(false);
      navigate("/reset-password");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    }
  };

  // ==== Login & Register ====
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // ✅ LOGIN FLOW
        const res = await api.post("/login", { email, password });

        // get token (from backend)
        const token =
          res.data?.data?.tokens?.accessToken ||
          res.data?.token ||
          res.data?.accessToken;

        if (!token) {
          alert("Login failed. Token not received.");
          return;
        }

        // ✅ FIXED: Store token as "token" to match Navbar
        localStorage.setItem("token", token);
        
        // ✅ Also store as accessToken for API calls (if needed)
        localStorage.setItem("accessToken", token);
        
        // ✅ Dispatch event to update Navbar immediately
        window.dispatchEvent(new Event("authChanged"));
        
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        // ✅ REGISTER FLOW
        const res = await api.post("/register", {
          name: fullName,
          email,
          password,
          role,
        });

        alert("OTP sent to your email for verification.");
        navigate("/verify-otp", { state: { email } });
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // ==== UI ====
  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>

      <div style={styles.card}>
        <h1 style={styles.title}>{isLogin ? "Welcome Back" : "Join eScout"}</h1>
        <p style={styles.subtitle}>
          {isLogin
            ? "Login to continue your esports journey"
            : "Create your eScout account and start competing!"}
        </p>

        {/* Social Login */}
        <div style={styles.socialContainer}>
          <button style={styles.socialBtn} onClick={handleGoogleLogin}>
            <FaGoogle style={{ ...styles.icon, color: "#DB4437" }} />
          </button>
          <button style={styles.socialBtn} onClick={handleFacebookLogin}>
            <FaFacebookF style={{ ...styles.icon, color: "#1877F2" }} />
          </button>
          <button style={styles.socialBtn} onClick={handleTwitterLogin}>
            <FaXTwitter style={{ ...styles.icon, color: "#000" }} />
          </button>
        </div>

        <div style={styles.divider}>
          <span style={styles.line}></span>
          <p style={styles.or}>or</p>
          <span style={styles.line}></span>
        </div>

        {/* Main Form */}
        <form style={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                style={styles.input}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <select
                name="role"
                style={styles.input}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                <option value="player">Player</option>
                <option value="scout">Scout</option>
              </select>
            </>
          )}

          <input
            type="email"
            placeholder="Email Address"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isLogin && (
            <button
              type="button"
              style={styles.forgotBtn}
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          )}

          <button type="submit" style={styles.submitBtn}>
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.switchText}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button style={styles.switchBtn} onClick={handleSwitch}>
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Confirm Your Email</h2>
            <p style={styles.modalText}>
              Enter your registered email address to receive an OTP to reset password.
            </p>
            <form onSubmit={handleConfirmEmail}>
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                style={styles.input}
              />
              <div style={styles.modalButtons}>
                <button type="submit" style={styles.submitBtn}>
                  Send OTP
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* === Styles === */
const styles = {
  container: {
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundImage: "url('https://cdn.wallpapersafari.com/15/78/zsvsR0.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    fontFamily: "'Poppins', sans-serif",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    zIndex: 0,
  },
  card: {
    position: "relative",
    zIndex: 1,
    width: "380px",
    background: "rgba(20, 20, 20, 0.85)",
    backdropFilter: "blur(10px)",
    borderRadius: "18px",
    padding: "40px 45px",
    color: "#fff",
    textAlign: "center",
    boxShadow: "0 0 40px rgba(172, 114, 67, 0.34)",
  },
  title: { fontSize: "30px", color: "#be5e1e", marginBottom: "8px" },
  subtitle: { color: "#aaa", fontSize: "14px", marginBottom: "25px" },
  socialContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "18px",
    marginBottom: "22px",
  },
  socialBtn: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    background: "#fff",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  icon: { fontSize: "20px" },
  divider: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "25px",
  },
  line: { flex: 1, height: "1px", backgroundColor: "#333" },
  or: { margin: "0 10px", fontSize: "13px", color: "#777" },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  input: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    outline: "none",
    fontSize: "15px",
  },
  forgotBtn: {
    background: "transparent",
    border: "none",
    color: "#5771f2ff",
    fontWeight: "500",
    textAlign: "right",
    fontSize: "13px",
    cursor: "pointer",
    marginTop: "-6px",
    marginBottom: "10px",
  },
  submitBtn: {
    backgroundColor: "#b35313ff",
    color: "#000",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "15px",
    marginTop: "10px",
    cursor: "pointer",
  },
  cancelBtn: {
    backgroundColor: "transparent",
    border: "1px solid #be5e1e",
    color: "#be5e1e",
    padding: "10px 14px",
    borderRadius: "8px",
    fontWeight: "500",
    cursor: "pointer",
  },
  footer: { marginTop: "20px" },
  switchText: { color: "#bbb", fontSize: "13px" },
  switchBtn: {
    background: "none",
    border: "none",
    color: "#be5e1e",
    fontWeight: "600",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  modal: {
    background: "rgba(25,25,25,0.95)",
    padding: "30px",
    borderRadius: "16px",
    width: "340px",
    textAlign: "center",
    color: "#fff",
    boxShadow: "0 0 25px rgba(149, 92, 34, 0.86)",
  },
  modalTitle: { fontSize: "22px", color: "#be5e1e", marginBottom: "10px" },
  modalText: { fontSize: "14px", color: "#bbb", marginBottom: "18px" },
  modalButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },
};

export default AuthPage;