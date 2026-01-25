import React from "react";
import "./Program.css";
import ImgValorant from '../../assets/img6.png';
import ImgPubg from '../../assets/img3.jpg';
import ImgCod from '../../assets/img7.jpg';
import ImgFortnite from '../../assets/img8.jpg';
import ImgFreeFire from '../../assets/img2.jpg';
import ImgLol from '../../assets/img2.jpg';
import ImgCS2 from '../../assets/img3.jpg';
import ImgDota from '../../assets/img4.jpg';
import { Crosshair } from "lucide-react"; 

export default function Program() {
  const games = [
    { name: "VALORANT", genre: "TACTICAL FPS", img: ImgValorant },
    { name: "LEAGUE OF LEGENDS", genre: "MOBA", img: ImgLol },
    { name: "CS2", genre: "TACTICAL SHOOTER", img: ImgCS2 },
    { name: "PUBG MOBILE", genre: "BATTLE ROYALE", img: ImgPubg },
    { name: "DOTA 2", genre: "STRATEGY", img: ImgDota },
    { name: "CALL OF DUTY", genre: "FPS", img: ImgCod },
    { name: "FORTNITE", genre: "BUILD & BATTLE", img: ImgFortnite },
    { name: "FREE FIRE", genre: "SURVIVAL", img: ImgFreeFire },
  ];

  return (
    <section className="program-section">
      <div className="program-header">
        <h2 className="program-title">ACTIVE <span className="text-red">WARZONES</span></h2>
        <p className="program-subtitle">SELECT YOUR DISCIPLINE</p>
      </div>

      <div className="games-grid">
        {games.map((game, index) => (
          <div className="game-card" key={index}>
            <div className="card-media">
              <img src={game.img} alt={game.name} />
              <div className="overlay-gradient"></div>
            </div>
            
            <div className="card-details">
              <div className="text-area">
                <span className="game-genre">{game.genre}</span>
                <h3 className="game-name">{game.name}</h3>
              </div>
              
              <button className="card-action-btn">
                <span>FIND TOURNAMENTS</span>
                <Crosshair size={20} className="scope-icon" />
              </button>
            </div>

            {/* --- THE 4 CORNER BULLETS --- */}
            {/* These will pop out like projectiles on hover */}
            <div className="bullet b-tl"></div>
            <div className="bullet b-tr"></div>
            <div className="bullet b-bl"></div>
            <div className="bullet b-br"></div>

          </div>
        ))}
      </div>
    </section>
  );
}