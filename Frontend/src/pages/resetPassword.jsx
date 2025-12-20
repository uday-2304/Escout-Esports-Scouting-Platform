import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/Axios";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/reset-password", {
        email,
        otp,
        newPassword,
      });
      alert(res.data.message || "Password reset successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Your Password</h2>
        <p style={styles.subtitle}>
          Enter the OTP you received in your email along with your new password.
        </p>
        <form onSubmit={handleResetPassword} style={styles.form}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p style={styles.footer}>
          <button
            style={styles.backBtn}
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, rgba(0,0,0,0.9), rgba(30,30,30,0.95)), url('https://cdn.wallpapersafari.com/15/78/zsvsR0.jpg') center/cover no-repeat",
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    background: "rgba(25,25,25,0.9)",
    padding: "40px",
    borderRadius: "16px",
    color: "#fff",
    width: "360px",
    boxShadow: "0 0 25px rgba(190,94,30,0.6)",
  },
  title: { fontSize: "24px", color: "#be5e1e", marginBottom: "10px" },
  subtitle: { fontSize: "14px", color: "#bbb", marginBottom: "25px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#1a1a1a",
    color: "#fff",
    fontSize: "15px",
  },
  submitBtn: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#be5e1e",
    color: "#000",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
  },
  footer: { textAlign: "center", marginTop: "20px" },
  backBtn: {
    background: "none",
    border: "none",
    color: "#be5e1e",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
  },
};

export default ResetPasswordPage;
