import React from 'react';
import './Hero.css';
// ⚠️ Update this path to your image
import heroBgImage from '../../assets/homepage.jpg'; 

const Hero = () => {
  return (
    <div className='hero-container'>
      
      {/* 1. Left: Image Section */}
      <div className="hero-image-wrapper">
        <img 
          src={heroBgImage} 
          alt="Samurai Character" 
          className="hero-img" 
        />
        {/* Seamless Blend Overlay */}
        <div className="hero-image-overlay"></div>
      </div>

      {/* 2. Right: Text Section */}
      <div className='hero-text-wrapper'>
        
        {/* Continuous Particle Stream Animation */}
        <div className="tech-header-anim">
            <div className="particle-stream p1"></div>
            <div className="particle-stream p2"></div>
        </div>

        {/* Big, Clean, Rich Text */}
        <h1>Play.<br/>Compete.<br/>Conquer.</h1>
        <p>
          Join the next generation of competitive gaming. Battle, stream, and rise to the top 
          of the E-sports world. Witness epic showdowns and register for global events today.
        </p>
      </div>

      {/* 3. Frame UI */}
      <div className="tech-frame">
        <div className="crosshair tl">+</div>
        <div className="crosshair br">+</div>
      </div>

    </div>
  )
}

export default Hero;