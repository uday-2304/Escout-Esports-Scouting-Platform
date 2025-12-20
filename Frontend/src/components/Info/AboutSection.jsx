import React from "react";
import "./About.css";
import Img1 from "../../assets/img2.jpg";
import Img2 from "../../assets/img3.jpg";
import Img3 from "../../assets/img4.jpg";
import Img4 from "../../assets/img7.jpg";

const steps = [
  {
    title: "1️⃣ Upload Gameplay",
    desc: "Gamers upload their best clips securely to showcase their talent. Videos are hosted via YouTube or Cloudinary.",
    img: Img1,
  },
  {
    title: "2️⃣ AI Analyzes Skill",
    desc: "AI reviews accuracy, strategy, and reflexes — assigning a verified performance rating for scouts.",
    img: Img2,
  },
  {
    title: "3️⃣ Scouts Discover Talent",
    desc: "Recruiters explore verified player profiles, filtering by game, rank, or region with detailed stats.",
    img: Img3,
  },
  {
    title: "4️⃣ Connect & Recruit",
    desc: "Scouts message players directly to schedule tryouts or join professional teams seamlessly.",
    img: Img4,
  },
];

const AboutSection = () => {
  return (
    <section className="about-section">
      <h2 className="about-heading">How eScout Works</h2>
      <p className="about-subtitle">
        A complete journey from uploading gameplay to getting discovered by top eSports teams.
      </p>

      <div className="about-grid">
        {steps.map((step, index) => (
          <div className="about-card" key={index}>
            <div className="card-image">
              <img src={step.img} alt={step.title} />
            </div>
            <div className="card-text">
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
