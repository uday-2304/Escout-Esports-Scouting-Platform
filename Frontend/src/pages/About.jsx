import React from "react";

const AboutPage = () => {
  return (
    <div style={styles.aboutContainer}>
      {/* Header */}
      <section style={styles.headerSection}>
        <h1 style={styles.title}>About eScout</h1>
        <p style={styles.subtitle}>
          Empowering the next generation of esports talent — connecting players,
          creators, and teams across the globe.
        </p>
      </section>

      {/* Section 1 - Who We Are */}
      <section style={styles.section}>
        <div style={styles.imageContainer}>
          <img
            src="https://images.unsplash.com/photo-1606112219348-204d7d8b94ee"
            alt="Who We Are"
            style={styles.imageLarge}
          />
        </div>
        <div style={styles.textContainer}>
          <h2 style={styles.heading}>Who We Are</h2>
          <p style={styles.text}>
            eScout is the next-generation esports discovery platform built for
            players who dream big. We bridge the gap between talent and
            opportunity — where gamers showcase skills, teams find players, and
            legends are made.
          </p>
        </div>
      </section>


      {/* Section 3 - What We Do */}
      <section style={styles.sectionAlt}>
        <div style={styles.textContainer}>
          <h2 style={styles.heading}>What We Do</h2>
          <p style={styles.text}>
            We make esports scouting transparent and performance-driven.
            Gamers can upload their clips, build digital portfolios, and track
            their progress. Teams and organizations can filter, analyze, and
            recruit based on real gameplay — not just reputation.
          </p>
        </div>
        <div style={styles.imageContainerSmall}>
          <img
            src="https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf"
            alt="Analytics"
            style={styles.imageSmall}
          />
        </div>
      </section>

      {/* Section 4 - Our Vision (center layout) */}
      <section style={styles.centerSection}>
        <h2 style={styles.headingCenter}>Our Vision</h2>
        <p style={styles.textCenter}>
          We envision a world where every gamer’s effort is visible, where skill
          earns recognition, and where esports thrives on fairness and data —
          not favoritism.
        </p>
        <img
          src="https://images.unsplash.com/photo-1556817411-31ae72fa3ea0"
          alt="Vision"
          style={styles.centerImage}
        />
      </section>

      {/* Section 5 - Stats */}
      <section style={styles.statsSection}>
        <div style={styles.statBox}>
          <h3 style={styles.statNumber}>12K+</h3>
          <p style={styles.statText}>Registered Players</p>
        </div>
        <div style={styles.statBox}>
          <h3 style={styles.statNumber}>200+</h3>
          <p style={styles.statText}>Active Scouts</p>
        </div>
        <div style={styles.statBox}>
          <h3 style={styles.statNumber}>50+</h3>
          <p style={styles.statText}>Partnered Teams</p>
        </div>
      </section>
    </div>
  );
};

/* 🎨 Inline CSS */
const styles = {
  aboutContainer: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#0a0a0a",
    color: "#fff",
    padding: "60px 8%",
  },
  headerSection: {
    textAlign: "center",
    marginBottom: "80px",
  },
  title: {
    fontSize: "3rem",
    color: "#be5e1e",
    fontWeight: 700,
    marginBottom: "15px",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#bbb",
    maxWidth: "800px",
    margin: "0 auto",
  },
  section: {
    display: "flex",
    alignItems: "center",
    gap: "60px",
    flexWrap: "wrap",
    marginBottom: "100px",
  },
  sectionAlt: {
    display: "flex",
    alignItems: "center",
    gap: "60px",
    flexWrap: "wrap-reverse",
    marginBottom: "100px",
  },
  textContainer: {
    flex: 1,
    minWidth: "320px",
  },
  heading: {
    fontSize: "2rem",
    color: "#be5e1e",
    marginBottom: "15px",
  },
  text: {
    fontSize: "1.05rem",
    color: "#ccc",
    lineHeight: 1.7,
  },
  imageContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  imageContainerSmall: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  imageLarge: {
    width: "100%",
    borderRadius: "5px",
    height: "420px",
    objectFit: "cover",
  },
  imageSmall: {
    width: "100%",
    borderRadius: "5px",
    height: "340px",
    objectFit: "cover",
  },

  centerSection: {
    textAlign: "center",
    marginBottom: "100px",
  },
  headingCenter: {
    fontSize: "2rem",
    color: "#be5e1e",
    marginBottom: "20px",
  },
  textCenter: {
    fontSize: "1.1rem",
    color: "#ccc",
    maxWidth: "750px",
    margin: "0 auto 40px",
    lineHeight: 1.8,
  },
  centerImage: {
    width: "100%",
    maxWidth: "1100px",
    borderRadius: "5px",
    height: "350px",
    objectFit: "cover",
    margin: "0 auto",
    display: "block",
  },
  statsSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "80px",
    flexWrap: "wrap",
    borderTop: "1px solid #222",
    paddingTop: "60px",
  },
  statBox: {
    textAlign: "center",
  },
  statNumber: {
    fontSize: "2.5rem",
    color: "#be5e1e",
    fontWeight: 700,
  },
  statText: {
    color: "#bbb",
    fontSize: "1rem",
  },
};

export default AboutPage;
