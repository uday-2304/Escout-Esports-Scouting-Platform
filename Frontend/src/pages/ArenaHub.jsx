import React, { useEffect, useState } from "react";
import { FaSearch, FaPlay, FaEye, FaSquareFull, FaChevronDown } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const API_BASE_URL = "http://localhost:8000";
const GAMES = ["All", "PUBG", "FreeFire", "Fortnite", "COD", "Minecraft"];

const ArenaHub = () => {
  const [videos, setVideos] = useState({});
  const [selectedGame, setSelectedGame] = useState("All");
  const [selectedRole, setSelectedRole] = useState("players"); // 'players' or 'creators'
  const [expandedSection, setExpandedSection] = useState("players"); // Which dropdown is open
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);

  /* ===== Fetch Logic ===== */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/arena/arena-videos`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(data || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setVisibleCount(12);
  }, [selectedGame, selectedRole, search]);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSelection = (role, game) => {
    setSelectedRole(role);
    setSelectedGame(game);
  };

  /* ===== Shuffle helper ===== */
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  /* ===== Prepare videos ===== */
  // Note: Since we don't have real "role" data in the mock API, 
  // we re-shuffle when the role changes to simulate different content.
  const allVideos = Object.values(videos).flat();
  let displayVideos = selectedGame === "All" ? shuffleArray(allVideos) : videos[selectedGame] || [];

  displayVideos = displayVideos.filter((video) =>
    video?.snippet?.channelTitle?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{
        height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#000", color: "#fff", fontFamily: "'Orbitron', sans-serif", letterSpacing: "4px"
      }}>
        SYSTEM_INITIALIZING...
      </div>
    );
  }

  return (
    <div className="arena-layout">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Syncopate:wght@400;700&family=Rajdhani:wght@500;600&display=swap');

        :root {
          --bg-deep: #000000;
          --bg-panel: #0a0a0a;
          --accent: #fff; 
          --highlight: rgb(170, 1, 255); /* Cyber Blue */
          --border-color: #333;
          --text-main: #ededed;
          --text-muted: #666;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 1px; }
        ::-webkit-scrollbar-track { background: var(--bg-deep); }
        ::-webkit-scrollbar-thumb { background: var(--highlight); }

        .arena-layout {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-deep);
          color: var(--text-main);
          font-family: 'Rajdhani', sans-serif;
        }

        /* ===== SIDEBAR (Architectural) ===== */
        .sidebar {
          width: 280px;
          background: var(--bg-panel);
          border-right: 1px solid var(--border-color);
          padding: 40px 0;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 20;
          overflow-y: auto;
        }

        .brand-section {
          padding: 0 30px;
          margin-bottom: 40px;
        }

        .sidebar-title {
          font-family: 'Syncopate', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 2px;
          border-left: 2px solid var(--highlight);
          padding-left: 15px;
        }

        /* DROPDOWN STYLES */
        .menu-group {
          border-bottom: 1px solid #1a1a1a;
        }

        .group-header {
          width: 100%;
          padding: 20px 30px;
          background: transparent;
          border: none;
          color: var(--text-main);
          font-family: 'Orbitron', sans-serif;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.2s;
        }

        .group-header:hover {
          background: #111;
          color: var(--highlight);
        }

        .chevron {
          font-size: 10px;
          transition: transform 0.3s ease;
          color: var(--text-muted);
        }

        .group-header:hover .chevron {
          color: var(--highlight);
        }

        .chevron.rotate {
          transform: rotate(180deg);
        }

        /* DROPDOWN LIST */
        .group-list {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          background: #050505;
        }

        .group-list.open {
          max-height: 600px; /* Arbitrary large height */
          border-bottom: 1px solid var(--border-color);
        }

        .game-btn {
          width: 100%;
          padding: 15px 30px 15px 40px; /* Indented */
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          text-align: left;
          font-family: 'Rajdhani', sans-serif;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.2s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }

        .game-btn::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 0px;
          background: var(--highlight);
          transition: width 0.2s;
        }

        .game-btn:hover {
          background: #0f0f0f;
          color: var(--accent);
          padding-left: 50px; /* Slide effect */
        }

        .game-btn:hover::before {
          width: 2px;
        }

        .game-btn.active {
          background: #111;
          color: var(--highlight);
          text-shadow: 0 0 10px rgba(130, 7, 206, 0.68);
        }

        .game-btn.active::before {
          width: 4px;
        }

        /* ===== CONTENT ===== */
        .content {
          flex: 1;
          margin-left: 280px;
          padding: 60px 80px;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        /* HEADER */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 60px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 30px;
        }

        .arena-header-title h1 {
          font-family: 'Syncopate', sans-serif;
          font-size: 48px;
          font-weight: 700;
          color: var(--accent);
          letter-spacing: -2px;
          margin-bottom: 5px;
        }

        .subtitle {
          font-family: 'Orbitron', sans-serif;
          font-size: 12px;
          color: var(--highlight);
          letter-spacing: 4px;
          text-transform: uppercase;
        }

        .search-box {
          position: relative;
          width: 400px;
        }

        .search-box input {
          width: 100%;
          padding: 15px 20px;
          background: transparent;
          border: 1px solid var(--border-color);
          border-left: 2px solid var(--highlight);
          color: var(--accent);
          font-family: 'Rajdhani', sans-serif;
          font-size: 16px;
          outline: none;
          transition: all 0.3s;
        }

        .search-box input:focus {
          background: #050505;
          border-color: var(--accent);
        }

        .search-icon {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        /* GRID & CARD */
        .arena-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 40px;
        }

        .video-card {
          position: relative;
          background: #000;
          border: 1px solid #222;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .video-card:hover {
          transform: translate(-5px, -5px);
          border-color: var(--highlight);
          box-shadow: 5px 5px 0px rgba(255, 255, 255, 0.1);
          z-index: 10;
        }

        .thumbnail-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          overflow: hidden;
          -webkit-mask-image: -webkit-radial-gradient(white, black);
        }

        .arena-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(20%);
          transition: all 0.5s ease;
        }

        .video-card:hover .arena-thumbnail {
          filter: grayscale(0%);
          transform: scale(1.02);
        }

        .play-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .video-card:hover .play-overlay { opacity: 1; }

        .play-btn-square {
          width: 60px;
          height: 60px;
          border: 1px solid var(--highlight);
          background: rgba(0, 240, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--highlight);
          transition: transform 0.2s;
        }
        
        .video-card:hover .play-btn-square {
          transform: rotate(45deg);
        }
        .play-btn-square svg {
          transform: rotate(-45deg);
        }

        .card-body {
          padding: 20px;
          border-top: 1px solid #111;
          background: #050505;
        }

        .channel-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .channel-avatar {
          width: 30px;
          height: 30px;
          object-fit: cover;
          border: 1px solid #444;
        }

        .channel-name {
          font-family: 'Orbitron', sans-serif;
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .video-title {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 12px;
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .video-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .views-count {
          color: var(--highlight);
        }

        .show-more-container {
          margin-top: 80px;
          display: flex;
          justify-content: center;
        }

        .load-more-btn {
          background: transparent;
          border: 1px solid var(--text-muted);
          color: var(--text-main);
          padding: 15px 50px;
          font-family: 'Orbitron', sans-serif;
          font-size: 12px;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .load-more-btn:hover {
          border-color: var(--highlight);
          background: rgba(0, 240, 255, 0.05);
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.1);
        }

        .video-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .video-modal-content {
          position: relative;
          width: 85%;
          max-width: 1100px;
          aspect-ratio: 16/9;
          background: #000;
          border: 1px solid var(--highlight);
          box-shadow: 0 0 100px rgba(0, 240, 255, 0.1);
        }

        .close-modal-btn {
          position: absolute;
          top: -50px;
          right: -20px;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 30px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .close-modal-btn:hover {
          color: var(--highlight);
          transform: rotate(90deg);
        }
      `}</style>

      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="brand-section">
          <h2 className="sidebar-title">DATA_SECTOR</h2>
        </div>

        {/* --- PLAYERS SECTION --- */}
        <div className="menu-group">
          <button 
            className="group-header" 
            onClick={() => toggleSection("players")}
          >
            <span>PLAYERS</span>
            <FaChevronDown className={`chevron ${expandedSection === "players" ? "rotate" : ""}`} />
          </button>
          
          <div className={`group-list ${expandedSection === "players" ? "open" : ""}`}>
            {GAMES.map((game) => (
              <button
                key={`player-${game}`}
                className={`game-btn ${selectedRole === "players" && selectedGame === game ? "active" : ""}`}
                onClick={() => handleSelection("players", game)}
              >
                {game}
                {selectedRole === "players" && selectedGame === game && <FaSquareFull size={6} color="#00f0ff" />}
              </button>
            ))}
          </div>
        </div>

        {/* --- CREATORS SECTION --- */}
        <div className="menu-group">
          <button 
            className="group-header" 
            onClick={() => toggleSection("creators")}
          >
            <span>CREATORS</span>
            <FaChevronDown className={`chevron ${expandedSection === "creators" ? "rotate" : ""}`} />
          </button>
          
          <div className={`group-list ${expandedSection === "creators" ? "open" : ""}`}>
            {GAMES.map((game) => (
              <button
                key={`creator-${game}`}
                className={`game-btn ${selectedRole === "creators" && selectedGame === game ? "active" : ""}`}
                onClick={() => handleSelection("creators", game)}
              >
                {game}
                {selectedRole === "creators" && selectedGame === game && <FaSquareFull size={6} color="#00f0ff" />}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="content">
        
        {/* Header */}
        <header className="header">
          <div className="arena-header-title">
            <p className="subtitle">
              SECTOR: <span style={{color: '#fff'}}>{selectedRole}</span> // GAME: <span style={{color: '#00f0ff'}}>{selectedGame}</span>
            </p>
            <h1>ARENA HUB</h1>
          </div>
          
          <div className="search-box">
            <input
              type="text"
              placeholder="SEARCH DATABASE..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
        </header>

        {/* Video Grid */}
        <div className="arena-grid">
          {displayVideos.slice(0, visibleCount).map((video) => {
            const id = video?.id?.videoId || video?.id;
            return (
              <div 
                key={id} 
                className="video-card" 
                onClick={() => setSelectedVideo(video)}
              >
                {/* Thumbnail */}
                <div className="thumbnail-wrapper">
                  <img
                    src={video?.snippet?.thumbnails?.high?.url}
                    alt={video?.snippet?.title}
                    className="arena-thumbnail"
                  />
                  <div className="play-overlay">
                    <div className="play-btn-square">
                      <FaPlay size={16} />
                    </div>
                  </div>
                </div>

                {/* Info Body */}
                <div className="card-body">
                  <div className="channel-info">
                    <img 
                      src={video.channelIcon || "https://via.placeholder.com/32"} 
                      alt="avatar" 
                      className="channel-avatar" 
                    />
                    <span className="channel-name">{video?.snippet?.channelTitle}</span>
                  </div>
                  
                  <h3 className="video-title">{video?.snippet?.title}</h3>
                  
                  <div className="video-footer">
                    <span className="views-count">
                      {Number(video.statistics?.viewCount || 0).toLocaleString()} <span style={{color:'#444'}}>VIEWS</span>
                    </span>
                    <FaEye color="#333" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {visibleCount < displayVideos.length && (
          <div className="show-more-container">
            <button className="load-more-btn" onClick={() => setVisibleCount((v) => v + 9)}>
              [ LOAD_MORE_DATA ]
            </button>
          </div>
        )}
      </main>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedVideo(null)}>
              <IoMdClose />
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${
                selectedVideo?.id?.videoId || selectedVideo?.id
              }?autoplay=1`}
              title="Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArenaHub;