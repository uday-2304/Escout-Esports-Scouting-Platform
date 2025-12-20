import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/Axios";

const OtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // ✅ Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/verify-otp", { otp });
      alert("✅ Account verified successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Handle Resend OTP
  const handleResendOtp = async () => {
    try {
      setResendTimer(30); // 30 sec cooldown
      await api.post("/resend-otp", { email });
      alert("📩 New OTP sent to your email!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Verify Your Email</h2>
        <p style={styles.subtitle}>
          Enter the OTP sent to <span style={styles.email}>{email}</span>
        </p>

        <form onSubmit={handleVerifyOtp} style={styles.form}>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
            style={styles.input}
          />

          <button
            type="submit"
            style={{
              ...styles.button,
              background: loading ? "#555" : "#be5e1e",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div style={styles.resendContainer}>
          {resendTimer > 0 ? (
            <p style={styles.timer}>
              ⏳ Resend available in <b>{resendTimer}s</b>
            </p>
          ) : (
            <button onClick={handleResendOtp} style={styles.resendBtn}>
              🔁 Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ====== STYLES ====== */
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)",
  },
  card: {
    background: "rgba(34, 34, 34, 0.9)",
    padding: "45px",
    borderRadius: "14px",
    boxShadow: "0 4px 25px rgba(0,0,0,0.4)",
    color: "#fff",
    textAlign: "center",
    width: "90%",
    maxWidth: "420px",
    border: "1px solid #2e2e2e",
  },
  title: {
    fontSize: "24px",
    marginBottom: "12px",
    color: "#ffffff",
    letterSpacing: "1px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#ccc",
    marginBottom: "25px",
  },
  email: {
    color: "#be5e1e",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  input: {
    width: "80%",
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #444",
    outline: "none",
    background: "#1e1e1e",
    color: "#fff",
    textAlign: "center",
    fontSize: "16px",
    letterSpacing: "2px",
    transition: "border 0.3s ease",
  },
  button: {
    width: "85%",
    background: "#be5e1e",
    border: "none",
    padding: "12px 0",
    color: "#fff",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "8px",
    marginTop: "5px",
    transition: "background 0.3s ease, transform 0.2s ease",
  },
  resendContainer: {
    marginTop: "20px",
  },
  resendBtn: {
    background: "transparent",
    color: "#be5e1e",
    border: "1px solid #be5e1e",
    borderRadius: "6px",
    padding: "8px 16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  timer: {
    color: "#aaa",
    fontSize: "14px",
  },
};

export default OtpPage;
