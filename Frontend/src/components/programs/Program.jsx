import React, { useRef } from "react";
import "./Program.css";
import Home1 from '../../assets/home1.jpg';
import Img2 from '../../assets/img2.jpg';
import Img3 from '../../assets/img3.jpg';
import Img6 from '../../assets/img6.png';
import Img7 from '../../assets/img7.jpg';
import Img8 from '../../assets/img8.jpg';
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Program() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 350; // Scroll roughly one card width
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const images = [
    { src: Home1, name: "E-Sports", sub: "Competitive" },
    { src: Img2, name: "Free-Fire", sub: "Survival" },
    { src: Img3, name: "PUBG", sub: "Battle Royale" },
    { src: Img6, name: "Valorant", sub: "Tactical FPS" },
    { src: Img7, name: "COD", sub: "Warfare" },
    { src: Img8, name: "Fortnite", sub: "Build & Battle" },
  ];

  return (
    <div className="carousel-wrapper">
      
      {/* Title Section */}
      <h2 className="carousel-title">Featured <span>Tournaments</span></h2>

      {/* Navigation Layer */}
      <div className="controls-container">
        <button className="arrow left" onClick={() => scroll("left")}>
          <ChevronLeft size={24} />
        </button>
        <button className="arrow right" onClick={() => scroll("right")}>
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Cards Container */}
      <div className="carousel-container" ref={scrollRef}>
        {images.map((item, index) => (
          <div className="carousel-item" key={index}>
            <img src={item.src} alt={item.name} />
            
            <div className="image-overlay">
              <span className="image-title">{item.name}</span>
              <span className="image-subtitle">{item.sub} /// ENTER</span>
            </div>
            
            {/* Tech Border Effect (Optional visual flair) */}
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '20px',
              height: '2px',
              background: '#00f3ff'
            }}></div>
          </div>
        ))}
      </div>

    </div>
  );
} 