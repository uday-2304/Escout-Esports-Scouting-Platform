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
    const scrollAmount = container.clientWidth * 0.6; 
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const images = [
    { src: Home1, name: "E-Sports" },
    { src: Img2, name: "Free-Fire" },
    { src: Img3, name: "PUBG" },
    { src: Img6, name: "Valorant" },
    { src: Img7, name: "COD" },
    { src: Img8, name: "Fortnite" },
  ];

  return (
    <div className="carousel-wrapper">
      <button className="arrow left" onClick={() => scroll("left")}>
        <ChevronLeft size={20} />
      </button>

      <div className="carousel-container" ref={scrollRef}>
        {images.map((item, index) => (
          <div className="carousel-item" key={index}>
            <img src={item.src} alt={item.name} />
            <div className="image-overlay">
              <span className="image-title">{item.name}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="arrow right" onClick={() => scroll("right")}>
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
