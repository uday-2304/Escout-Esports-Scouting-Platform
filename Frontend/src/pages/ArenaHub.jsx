import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:8000";
const GAMES = ["All", "PUBG", "FreeFire", "Fortnite", "COD", "Minecraft"];

const ArenaHub = () => {
  const [videos, setVideos] = useState({});
  const [selectedGame, setSelectedGame] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);

  // 🔽 NEW STATE (show videos gradually)
  const [visibleCount, setVisibleCount] = useState(9);

  /* ===== Fetch videos once ===== */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/arena/arena-videos`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(data || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ===== Reset visible videos when filter/search changes ===== */
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedGame, search]);

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
  const allVideos = Object.values(videos).flat();

  let displayVideos =
    selectedGame === "All"
      ? shuffleArray(allVideos)
      : videos[selectedGame] || [];

  displayVideos = displayVideos.filter((video) =>
    video?.snippet?.channelTitle
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "40vh" }}>
        Loading Arena Hub...
      </div>
    );
  }

  return (
    <div className="arena-layout">
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }

        .arena-layout {
          display: flex;
          min-height: 100vh;
          background: #0f0f0f;
          color: white;
          font-family: Roboto, Arial, sans-serif;
        }

        .sidebar {
          width: 220px;
          background: #020617;
          border-right: 1px solid #1e293b;
          padding: 20px;
        }

        .sidebar h2 {
          margin-bottom: 16px;
          color: #c74c00;
        }

        .game-btn {
          width: 100%;
          padding: 10px;
          margin-bottom: 8px;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          border-radius: 8px;
          text-align: left;
        }

        .game-btn.active {
          background: #1e293b;
          font-weight: bold;
        }

        .content {
          flex: 1;
          padding: 20px 30px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .arena-title {
          font-size: 2.2rem;
          font-weight: 800;
          background: linear-gradient(90deg, #aaa, #fff);
          -webkit-background-clip: text;
          color: transparent;
        }

        .search-box {
          position: relative;
        }

        .search-box input {
          padding: 8px 12px 8px 32px;
          border-radius: 999px;
          border: none;
          background: #1e293b;
          color: white;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
        }

        .arena-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .arena-thumbnail {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          border-radius: 14px;
        }

        .channel-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
        }

        .channel-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
        }

        .video-info h4 {
          margin: 6px 0 0;
          font-size: 14px;
        }

        .video-stats {
          font-size: 12px;
          color: #aaa;
          margin-top: 4px;
        }

        .show-more {
          margin: 25px 0;
          text-align: center;
        }

        .show-more button {
          background: #f9f9f92b;
          border: none;
          color: white;
          font-size: 22px;
          padding: 12px 20px;
          border-radius: 50%;
          cursor: pointer;
        }

        .video-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-content {
          position: relative;
          width: 90%;
          max-width: 850px;
        }

        .close-video {
          position: absolute;
          top: -30px;
          right: 0;
          cursor: pointer;
          font-size: 22px;
        }
      `}</style>

      {/* Sidebar */}
      <div className="sidebar">
        <h2>Games</h2>
        {GAMES.map((game) => (
          <button
            key={game}
            className={`game-btn ${selectedGame === game ? "active" : ""}`}
            onClick={() => {
              setFilterLoading(true);
              setTimeout(() => {
                setSelectedGame(game);
                setFilterLoading(false);
              }, 500);
            }}
          >
            {game}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="content">
        <div className="header">
          <h1 className="arena-title">Arena Hub</h1>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              placeholder="Search channel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="arena-grid">
          {displayVideos.slice(0, visibleCount).map((video) => {
            const id = video?.id?.videoId || video?.id;
            return (
              <div key={id} onClick={() => setSelectedVideo(video)}>
                <img
                  src={video?.snippet?.thumbnails?.high?.url}
                  className="arena-thumbnail"
                />
                <div className="channel-row">
                  <img src={video.channelIcon} className="channel-avatar" />
                  <span>{video?.snippet?.channelTitle}</span>
                </div>
                <h4>{video?.snippet?.title}</h4>
                <div className="video-stats">
                  👁 {Number(video.statistics?.viewCount || 0).toLocaleString()} views
                </div>
              </div>
            );
          })}
        </div>

        {/* ⬇ SHOW MORE BUTTON */}
        {visibleCount < displayVideos.length && (
          <div className="show-more">
            <button onClick={() => setVisibleCount((v) => v + 9)}>🠋</button>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="video-modal" onClick={() => setSelectedVideo(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-video">✖</span>
            <iframe
              width="100%"
              height="480"
              src={`https://www.youtube.com/embed/${
                selectedVideo?.id?.videoId || selectedVideo?.id
              }`}
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArenaHub;
