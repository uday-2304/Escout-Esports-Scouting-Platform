import React, { useEffect, useState } from "react";
import { FaSearch, FaPlay, FaCircle, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const API_BASE_URL = "http://localhost:8000";
const GAMES = ["All", "PUBG", "FreeFire", "Fortnite", "COD", "Valorant"];

const ArenaHub = () => {
  const [videos, setVideos] = useState({});
  const [selectedGame, setSelectedGame] = useState("All");
  const [selectedRole, setSelectedRole] = useState("players"); 
  const [expandedSection, setExpandedSection] = useState("players"); 
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);

  /* ===== Fetch Logic ===== */
  useEffect(() => {
    // Note: Make sure your local backend is running at this address
    fetch(`${API_BASE_URL}/api/arena/arena-videos`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(data || {});
        setLoading(false);
      })
      .catch(() => {
        console.error("Failed to fetch videos. Using empty data.");
        setVideos({});
        setLoading(false);
      });
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

  /* ===== Filter Logic ===== */
  const allVideos = Object.values(videos).flat();
  let displayVideos = selectedGame === "All" ? shuffleArray(allVideos) : videos[selectedGame] || [];

  // Safety check in case displayVideos is undefined
  displayVideos = (displayVideos || []).filter((video) =>
    video?.snippet?.title?.toLowerCase().includes(search.toLowerCase()) ||
    video?.snippet?.channelTitle?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-screen">
        {/* Embedded style for loading screen */}
        <style>{`
          .loading-screen {
            height: 100vh; background: #080808; display: flex; align-items: center; justify-content: center;
            color: #ff001f; font-family: 'Teko', sans-serif; font-size: 30px; letter-spacing: 5px;
          }
        `}</style>
        <div className="loader-text">INITIALIZING_DATALINK...</div>
      </div>
    );
  }

  return (
    <div className="arena-layout">
      {/* --- CSS STYLES --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Teko:wght@400;500;700&display=swap');

        :root {
          --bg-black: #080808;
          --bg-dark: #0f0f0f;
          --red-primary: #ff001f;
          --text-white: #f0f0f0;
          --text-dim: #666;
          --border-dark: #222;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: var(--bg-black); }

        .arena-layout {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-black);
          color: var(--text-white);
          font-family: 'Rajdhani', sans-serif;
        }

        /* ===== SIDEBAR ===== */
        .sidebar {
          width: 260px;
          background: rgba(10, 10, 10, 0.95);
          border-right: 1px solid var(--border-dark);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 50;
          backdrop-filter: blur(10px);
        }

        .brand-section {
          padding: 40px 30px;
          border-bottom: 1px solid var(--border-dark);
        }

        .sidebar-title {
          font-family: 'Teko', sans-serif;
          font-size: 28px;
          color: #fff;
          letter-spacing: 1px;
          line-height: 1;
        }

        .sidebar-title span { color: var(--red-primary); }

        .menu-container {
          padding: 20px 0;
          overflow-y: auto;
        }

        /* MENU GROUPS */
        .group-header {
          width: 100%;
          padding: 15px 30px;
          background: transparent;
          border: none;
          color: #888;
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: color 0.3s;
        }

        .group-header:hover { color: #fff; }

        .group-list {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
          background: rgba(255, 255, 255, 0.02);
        }

        .group-list.open { max-height: 500px; }

        .game-btn {
          width: 100%;
          padding: 12px 30px 12px 45px;
          background: transparent;
          border: none;
          color: #aaa;
          text-align: left;
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 10px;
          border-left: 2px solid transparent;
        }

        .game-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }

        .game-btn.active {
          color: var(--red-primary);
          background: linear-gradient(90deg, rgba(255, 0, 31, 0.1), transparent);
          border-left: 2px solid var(--red-primary);
        }

        /* ===== MAIN CONTENT ===== */
        .content {
          flex: 1;
          margin-left: 260px;
          padding: 50px 60px;
        }

        /* HEADER */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 50px;
          border-bottom: 1px solid var(--border-dark);
          padding-bottom: 20px;
        }

        .page-title h1 {
          font-family: 'Teko', sans-serif;
          font-size: 60px;
          text-transform: uppercase;
          line-height: 0.9;
          margin: 0;
        }

        .page-subtitle {
          color: var(--text-dim);
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .highlight-text { color: var(--red-primary); }

        /* SEARCH BAR */
        .search-container {
          position: relative;
          width: 300px;
        }

        .search-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #333;
          color: #fff;
          padding: 10px 30px 10px 0;
          font-family: 'Rajdhani', sans-serif;
          font-size: 16px;
          outline: none;
          transition: border-color 0.3s;
        }

        .search-input:focus {
          border-bottom-color: var(--red-primary);
        }

        .search-icon {
          position: absolute;
          right: 0;
          top: 10px;
          color: var(--text-dim);
        }

        /* GRID */
        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
        }

        /* VIDEO CARD (Professional & Simple) */
        .video-card {
          background: transparent;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .video-card:hover {
          transform: translateY(-5px);
        }

        .thumbnail-box {
          position: relative;
          aspect-ratio: 16/9;
          border-radius: 4px;
          overflow: hidden;
          background: #111;
        }

        .video-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.9; /* Slightly dim by default */
          transition: all 0.4s ease;
          /* REMOVED filter: grayscale(100%) */
        }

        .video-card:hover .video-thumb {
          opacity: 1;
          transform: scale(1.05);
          /* REMOVED filter: grayscale(0%) */
        }

        /* Play Button (Hidden -> Visible) */
        .overlay-icon {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          background: rgba(0,0,0,0.3);
        }

        .play-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--red-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 0 20px rgba(255, 0, 31, 0.5);
          transform: scale(0.8);
          transition: transform 0.3s;
        }

        .video-card:hover .overlay-icon { opacity: 1; }
        .video-card:hover .play-circle { transform: scale(1); }

        /* Card Meta */
        .card-meta {
          padding-top: 15px;
        }

        .vid-title {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .vid-stats {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .channel-name { color: var(--text-dim); transition: color 0.3s; }
        .video-card:hover .channel-name { color: var(--red-primary); }

        /* LOAD MORE */
        .load-more-container {
          margin-top: 60px;
          text-align: center;
        }

        .load-btn {
          background: transparent;
          border: 1px solid #333;
          color: #888;
          padding: 12px 40px;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 2px;
          transition: all 0.3s;
        }

        .load-btn:hover {
          border-color: var(--red-primary);
          color: #fff;
          background: rgba(255, 0, 31, 0.05);
        }

        /* MODAL */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.95);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-box {
          width: 80%;
          max-width: 1100px;
          aspect-ratio: 16/9;
          background: #000;
          position: relative;
          box-shadow: 0 0 50px rgba(255, 0, 31, 0.1);
          border: 1px solid #222;
        }

        .close-btn {
          position: absolute;
          top: -40px;
          right: 0;
          background: none;
          border: none;
          color: #fff;
          font-size: 30px;
          cursor: pointer;
          transition: color 0.3s;
        }

        .close-btn:hover { color: var(--red-primary); }

        /* SCROLLBAR */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--red-primary); }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .sidebar { display: none; }
          .content { margin-left: 0; padding: 20px; }
          .header { flex-direction: column; align-items: flex-start; gap: 20px; }
          .search-container { width: 100%; }
        }
      `}</style>

      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="brand-section">
          <h2 className="sidebar-title">ESCOUT <span>HUB</span></h2>
        </div>

        <div className="menu-container">
          {/* PLAYERS GROUP */}
          <div>
            <button className="group-header" onClick={() => toggleSection("players")}>
              PLAYERS DATABASE
              {expandedSection === "players" ? <FaChevronDown/> : <FaChevronRight/>}
            </button>
            <div className={`group-list ${expandedSection === "players" ? "open" : ""}`}>
              {GAMES.map((game) => (
                <button
                  key={`p-${game}`}
                  className={`game-btn ${selectedRole === "players" && selectedGame === game ? "active" : ""}`}
                  onClick={() => handleSelection("players", game)}
                >
                  {game}
                </button>
              ))}
            </div>
          </div>

          {/* CREATORS GROUP */}
          <div style={{ marginTop: '10px' }}>
            <button className="group-header" onClick={() => toggleSection("creators")}>
              CREATORS ARCHIVE
              {expandedSection === "creators" ? <FaChevronDown/> : <FaChevronRight/>}
            </button>
            <div className={`group-list ${expandedSection === "creators" ? "open" : ""}`}>
              {GAMES.map((game) => (
                <button
                  key={`c-${game}`}
                  className={`game-btn ${selectedRole === "creators" && selectedGame === game ? "active" : ""}`}
                  onClick={() => handleSelection("creators", game)}
                >
                  {game}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* ===== CONTENT ===== */}
      <main className="content">
        {/* Header */}
        <header className="header">
          <div className="page-title">
            <div className="page-subtitle">
              {selectedRole} // <span className="highlight-text">{selectedGame}</span>
            </div>
            <h1>MEDIA <span className="highlight-text">ARCHIVE</span></h1>
          </div>
          
          <div className="search-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder="SEARCH CLIPS..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
        </header>

        {/* Videos */}
        <div className="video-grid">
          {displayVideos.length > 0 ? (
            displayVideos.slice(0, visibleCount).map((video) => {
               const id = video?.id?.videoId || video?.id;
               // Safe fallback for thumbnails
               const thumbnailUrl = video?.snippet?.thumbnails?.high?.url || video?.snippet?.thumbnails?.medium?.url || "";
               
               return (
                 <div key={id} className="video-card" onClick={() => setSelectedVideo(video)}>
                   <div className="thumbnail-box">
                     {thumbnailUrl ? (
                       <img 
                          src={thumbnailUrl} 
                          alt={video?.snippet?.title} 
                          className="video-thumb"
                       />
                     ) : (
                       <div style={{width:'100%', height:'100%', background:'#222', display:'flex', alignItems:'center', justifyContent:'center'}}>No Image</div>
                     )}
                     <div className="overlay-icon">
                       <div className="play-circle">
                         <FaPlay size={16} style={{ marginLeft: '2px' }} />
                       </div>
                     </div>
                   </div>

                   <div className="card-meta">
                     <h3 className="vid-title">{video?.snippet?.title}</h3>
                     <div className="vid-stats">
                       <span className="channel-name">{video?.snippet?.channelTitle}</span>
                       <span>{Number(video.statistics?.viewCount || 0).toLocaleString()} VIEWS</span>
                     </div>
                   </div>
                 </div>
               );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
              NO INTEL FOUND FOR THIS SECTOR.
            </div>
          )}
        </div>

        {/* Load More */}
        {visibleCount < displayVideos.length && (
          <div className="load-more-container">
            <button className="load-btn" onClick={() => setVisibleCount((v) => v + 9)}>
              LOAD MORE DATA
            </button>
          </div>
        )}
      </main>

      {/* ===== MODAL ===== */}
      {selectedVideo && (
        <div className="modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedVideo(null)}>
              <IoMdClose />
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedVideo?.id?.videoId || selectedVideo?.id}?autoplay=1`}
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