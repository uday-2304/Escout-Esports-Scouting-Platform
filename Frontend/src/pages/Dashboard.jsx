import React, { useEffect, useState } from "react";
import { 
  FaHeart, FaCommentAlt, FaPlay, FaGamepad, 
  FaSearch, FaBell, FaChevronDown, FaPlus, FaUserAstronaut 
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [selectedGame, setSelectedGame] = useState("All");

  const currentUserId = localStorage.getItem("userId");
  const games = ["All", "PUBG", "Free Fire", "Valorant", "COD", "Fortnite"];

  /* ================= FETCH VIDEOS ================= */
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/dashboard/videos", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setVideos(data.videos || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  /* ================= LIKE VIDEO ================= */
  const likeVideo = async (id, e) => {
    e.stopPropagation(); 
    try {
      await fetch(`http://localhost:8000/api/dashboard/videos/${id}/like`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setVideos((prev) =>
        prev.map((v) => {
          if (v._id !== id) return v;
          const alreadyLiked = v.likes.includes(currentUserId);
          return {
            ...v,
            likes: alreadyLiked
              ? v.likes.filter((u) => u !== currentUserId)
              : [...v.likes, currentUserId],
          };
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filteredVideos = selectedGame === "All" ? videos : videos.filter((v) => v.game === selectedGame);

  return (
    <div className="dashboard-layout">
      {/* ===== CSS STYLES ===== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Teko:wght@400;500;700&display=swap');

        :root {
          --bg-black: #080808;
          --bg-dark: #111;
          --red-primary: #ff001f;
          --text-white: #f0f0f0;
          --text-dim: #666;
          --border-dark: #222;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body { background: var(--bg-black); }

        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-black);
          color: var(--text-white);
          font-family: 'Rajdhani', sans-serif;
        }

        /* ===== SIDEBAR ===== */
        .sidebar {
          width: 260px;
          padding: 40px 0;
          border-right: 1px solid var(--border-dark);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          background: rgba(8, 8, 8, 0.95);
          backdrop-filter: blur(10px);
          z-index: 50;
        }

        .brand {
          padding: 0 30px 40px 30px;
          border-bottom: 1px solid var(--border-dark);
          margin-bottom: 20px;
        }

        .brand-text {
          font-family: 'Teko', sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 1px;
          line-height: 1;
        }
        .brand-text span { color: var(--red-primary); }

        .nav-header {
          padding: 0 30px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-dim);
          margin-bottom: 15px;
          letter-spacing: 2px;
        }

        .filter-btn {
          width: 100%;
          padding: 12px 30px;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #888;
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border-left: 2px solid transparent;
        }

        .filter-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.03);
        }

        .filter-btn.active {
          color: var(--red-primary);
          background: linear-gradient(90deg, rgba(255, 0, 31, 0.1), transparent);
          border-left: 2px solid var(--red-primary);
        }

        .sidebar-footer {
          margin-top: auto;
          padding: 30px;
        }

        .rank-widget {
          padding: 15px;
          background: #111;
          border: 1px solid var(--border-dark);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }
        .rank-val { color: var(--red-primary); font-weight: 700; }

        /* ===== MAIN CONTENT ===== */
        .main-content {
          flex: 1;
          margin-left: 260px;
          padding: 40px 50px;
        }

        /* HEADER */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-dark);
        }

        .search-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border-bottom: 1px solid #333;
          padding: 8px 0;
          width: 300px;
          transition: border-color 0.3s;
        }
        .search-wrapper:focus-within { border-bottom-color: var(--red-primary); }

        .search-input {
          background: transparent;
          border: none;
          color: #fff;
          width: 100%;
          outline: none;
          font-family: 'Rajdhani', sans-serif;
          font-size: 16px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .upload-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid var(--red-primary);
          color: var(--red-primary);
          text-decoration: none;
          padding: 8px 20px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1px;
          transition: all 0.3s;
        }
        .upload-btn:hover {
          background: var(--red-primary);
          color: #fff;
          box-shadow: 0 0 15px rgba(255, 0, 31, 0.4);
        }

        .icon-btn { color: #666; cursor: pointer; transition: color 0.3s; }
        .icon-btn:hover { color: #fff; }

        .profile-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .avatar {
          width: 35px;
          height: 35px;
          background: #111;
          border: 1px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        /* HERO */
        .hero { margin-bottom: 40px; }
        .hero-title {
          font-family: 'Teko', sans-serif;
          font-size: 50px;
          font-weight: 500;
          color: #fff;
          line-height: 0.9;
          margin-bottom: 5px;
          text-transform: uppercase;
        }
        .hero-title span { color: var(--red-primary); }
        .hero-sub { color: var(--text-dim); letter-spacing: 1px; text-transform: uppercase; font-size: 14px;}

        /* GRID */
        .section-header {
          display: flex;
          align-items: baseline;
          gap: 15px;
          margin-bottom: 25px;
        }
        .section-title {
          font-family: 'Teko', sans-serif;
          font-size: 24px;
          font-weight: 500;
          text-transform: uppercase;
          color: #fff;
        }
        .count { color: var(--text-dim); font-size: 14px; }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
        }

        /* VIDEO CARD */
        .card {
          background: transparent;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        .card:hover { transform: translateY(-5px); }

        .thumb-wrapper {
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
          background: #111;
          margin-bottom: 12px;
          border: 1px solid #222;
          transition: border-color 0.3s;
        }
        .card:hover .thumb-wrapper { border-color: var(--red-primary); }

        .thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .card:hover .thumb { transform: scale(1.05); }

        .play-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .card:hover .play-overlay { opacity: 1; }

        .play-btn {
          width: 50px;
          height: 50px;
          border: 1px solid var(--red-primary);
          background: rgba(255, 0, 31, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          transform: rotate(45deg);
        }
        .play-btn svg { transform: rotate(-45deg); }

        .game-tag {
          position: absolute;
          top: 8px;
          left: 8px;
          background: var(--red-primary);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 6px;
          text-transform: uppercase;
        }

        .card-meta { padding: 0 5px; }
        .video-title {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .meta-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: var(--text-dim);
        }

        .actions { display: flex; gap: 15px; }
        .action-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #666;
          transition: color 0.2s;
        }
        .action-btn:hover { color: #fff; }

        .loading-text {
          color: var(--red-primary);
          font-family: 'Teko', sans-serif;
          font-size: 24px;
          letter-spacing: 2px;
        }

        /* MODAL */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.95);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }
        .modal-content {
          width: 80%;
          max-width: 1000px;
          aspect-ratio: 16/9;
          background: #000;
          border: 1px solid var(--red-primary);
          box-shadow: 0 0 50px rgba(255, 0, 31, 0.15);
        }
        .video-player { width: 100%; height: 100%; outline: none; }

        /* SCROLLBAR */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #333; }
        ::-webkit-scrollbar-thumb:hover { background: var(--red-primary); }

        @media (max-width: 900px) {
          .sidebar { display: none; }
          .main-content { margin-left: 0; padding: 20px; }
          .hero-title { font-size: 36px; }
        }
      `}</style>

      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-text">ARCADER <span>DASH</span></div>
        </div>

        <nav>
          <p className="nav-header">DATABASE FILTER</p>
          <div className="filter-group">
            {games.map((g) => (
              <button
                key={g}
                className={`filter-btn ${selectedGame === g ? "active" : ""}`}
                onClick={() => setSelectedGame(g)}
              >
                <FaGamepad size={14} />
                <span>{g.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="rank-widget">
            <span style={{color:'#666'}}>RANKING</span>
            <span className="rank-val">DIAMOND II</span>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main-content">
        
        {/* HEADER */}
        <header className="header">
          <div className="search-wrapper">
            <FaSearch color="#444" size={14} />
            <input type="text" placeholder="SEARCH CLIPS..." className="search-input" />
          </div>

          <div className="header-actions">
            <NavLink to="/add-video" className="upload-btn">
              <FaPlus size={12} /> UPLOAD CLIP
            </NavLink>
            <div className="icon-btn"><FaBell size={18} /></div>
            <div className="profile-badge">
              <div className="avatar"><FaUserAstronaut size={16}/></div>
              <FaChevronDown size={10} color="#666" />
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="hero">
          <h1 className="hero-title">GAMING <span>HIGHLIGHTS</span></h1>
          <p className="hero-sub">Your personal command center for top plays.</p>
        </section>

        {/* CONTENT GRID */}
        <section>
          <div className="section-header">
            <h2 className="section-title">TRENDING NOW</h2>
            <span className="count">[{filteredVideos.length}] RECORDS FOUND</span>
          </div>

          {loading ? (
            <p className="loading-text">LOADING SYSTEM...</p>
          ) : (
            <div className="grid">
              {filteredVideos.map((video) => {
                const isLiked = video.likes.includes(currentUserId);
                return (
                  <div key={video._id} className="card">
                    {/* Thumbnail */}
                    <div className="thumb-wrapper" onClick={() => setActiveVideo(video.videoUrl)}>
                      <img src={video.thumbnail} alt={video.title} className="thumb" />
                      <span className="game-tag">{video.game}</span>
                      <div className="play-overlay">
                        <div className="play-btn">
                          <FaPlay size={16} />
                        </div>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="card-meta">
                      <h3 className="video-title">{video.title}</h3>
                      <div className="meta-footer">
                        <span>{video.views || 0} VIEWS</span>
                        
                        <div className="actions">
                          <button className="action-btn" onClick={(e) => likeVideo(video._id, e)}>
                            <FaHeart color={isLiked ? "#ff001f" : "#444"} size={14} />
                            <span style={{ color: isLiked ? "#ff001f" : "#666" }}>{video.likes.length}</span>
                          </button>
                          <div className="action-btn">
                            <FaCommentAlt color="#444" size={12} />
                            <span>{video.commentsCount || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* ===== VIDEO MODAL ===== */}
      {activeVideo && (
        <div className="modal-overlay" onClick={() => setActiveVideo(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <video src={activeVideo} controls autoPlay className="video-player" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;