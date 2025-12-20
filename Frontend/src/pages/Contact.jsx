import React from "react";

const ContactPage = () => {
  return (
    <div style={styles.page}>
      {/* ===== CONTACT FORM ===== */}
      <section style={styles.contactSection}>
        <h1 style={styles.heading}>Contact Us</h1>

        <form style={styles.contactForm}>
          <div style={styles.row}>
            <input type="text" placeholder="Full Name" style={styles.input} />
            <input type="email" placeholder="Email Address" style={styles.input} />
          </div>

          <div style={styles.row}>
            <input type="text" placeholder="Phone Number" style={styles.input} />
            <input type="text" placeholder="Subject" style={styles.input} />
          </div>

          <textarea
            placeholder="Write your message here..."
            style={styles.textarea}
          ></textarea>

          <button type="submit" style={styles.submitBtn}>
            Send Message
          </button>
        </form>
      </section>

      {/* ===== DEVELOPERS SECTION ===== */}
      <section style={styles.teamSection}>
        <h2 style={styles.subHeading}>Developed By</h2>
        <div style={styles.teamGrid}>
          {[
            {
              name: "Uday Tejan",
              role: "Frontend Developer",
              img: "https://cdn.pixabay.com/photo/2017/01/31/13/14/avatar-2026510_1280.png",
            },
            {
              name: "Aarav Patel",
              role: "Backend Developer",
              img: "https://cdn.pixabay.com/photo/2017/01/31/13/14/avatar-2026520_1280.png",
            },
            {
              name: "Riya Sharma",
              role: "UI/UX Designer",
              img: "https://cdn.pixabay.com/photo/2017/01/31/13/14/avatar-2026511_1280.png",
            },
          ].map((dev, index) => (
            <div key={index} style={styles.teamCard}>
              <img src={dev.img} alt={dev.name} style={styles.teamImg} />
              <h4>{dev.name}</h4>
              <p>{dev.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

/* ===== INLINE CSS STYLES ===== */
const styles = {
  page: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#0b0b0b",
    color: "#fff",
    padding: "80px 8%",
  },

  contactSection: {
    textAlign: "center",
    marginBottom: "100px",
  },

  heading: {
    fontSize: "36px",
    marginBottom: "40px",
    color: "#be5e1e",
    letterSpacing: "1px",
  },

  contactForm: {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#121212",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 25px rgba(0,0,0,0.6)",
  },

  row: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },

  input: {
    flex: 1,
    padding: "15px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    backgroundColor: "#1c1c1c",
    color: "#fff",
    fontSize: "15px",
  },

  textarea: {
    width: "100%",
    height: "140px",
    padding: "15px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    backgroundColor: "#1c1c1c",
    color: "#fff",
    fontSize: "15px",
    marginBottom: "20px",
  },

  submitBtn: {
    padding: "14px 35px",
    backgroundColor: "#be5e1e",
    border: "none",
    borderRadius: "8px",
    color: "#000",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
  },

  teamSection: {
    textAlign: "center",
    backgroundColor: "#111",
    padding: "70px 8%",
    borderRadius: "12px",
  },

  subHeading: {
    fontSize: "30px",
    marginBottom: "40px",
    color: "#be5e1e",
  },

  teamGrid: {
    display: "flex",
    justifyContent: "center",
    gap: "50px",
    flexWrap: "wrap",
  },

  teamCard: {
    backgroundColor: "#1a1a1a",
    padding: "30px",
    borderRadius: "10px",
    width: "250px",
    boxShadow: "0 3px 15px rgba(0,0,0,0.4)",
  },

  teamImg: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    marginBottom: "15px",
  },
};

export default ContactPage;
