import React, { useEffect, useState } from "react";
import { FaHeart, FaCommentAlt, FaPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";

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
        const res = await fetch(
          "http://localhost:8000/api/dashboard/videos",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
          }
        );

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
  const likeVideo = async (id) => {
    try {
      await fetch(
        `http://localhost:8000/api/dashboard/videos/${id}/like`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );

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

  const filteredVideos =
    selectedGame === "All"
      ? videos
      : videos.filter((v) => v.game === selectedGame);

  return (
    <>
      {/* ================= CSS ================= */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #0b0b0b;
          font-family: "Poppins", sans-serif;
          color: #fff;
        }

        .layout {
          display: flex;
          min-height: 100vh;
        }

        /* ===== LEFT SIDEBAR ===== */
        .sidebar {
          width: 220px;
          padding: 30px 20px;
          background: #0e0e0e;
          border-right: 1px solid #1f1f1f;
        }

        .sidebar-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 25px;
        }

        .side-btn {
          display: block;
          width: 100%;
          padding: 10px 14px;
          margin-bottom: 10px;
          border-radius: 10px;
          background: transparent;
          border: none;
          color: #aaa;
          text-align: left;
          cursor: pointer;
        }

        .side-btn.active {
          background: #1a1a1a;
          color: #ff512f;
        }

        /* ===== MAIN CONTENT ===== */
        .content {
          flex: 1;
          padding: 40px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .add-btn {
          background: linear-gradient(90deg, #ff512f, #dd2476);
          padding: 10px 18px;
          border-radius: 10px;
          color: #fff;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
        }

        /* ===== VIDEO CARD ===== */
        .card {
          background: transparent;
        }

        .thumb {
          width: 100%;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          border-radius: 16px;
          cursor: pointer;
        }

        .card-body {
          padding-top: 10px;
        }

       .title {
  font-size: 14px;
  font-weight: 500;
  line-height: 2.0;
  margin-bottom: 6px;
  white-space: normal;
  word-break: break-word;
}


        .stats {
          display: flex;
          gap: 18px;
          font-size: 13px;
          color: #aaa;
        }

        .stats span {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: default;
        }

        .like {
          cursor: pointer;
        }

        .liked {
          color: #ff3b3b;
        }

        /* ===== VIDEO MODAL ===== */
        .video-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }

        .video-modal video {
          max-width: 90%;
          max-height: 90%;
          border-radius: 14px;
        }
      `}</style>

      {/* ================= JSX ================= */}
      <div className="layout">
        {/* LEFT SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-title">Games</div>
          {games.map((g) => (
            <button
              key={g}
              className={`side-btn ${selectedGame === g ? "active" : ""}`}
              onClick={() => setSelectedGame(g)}
            >
              {g}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div className="content">
          <div className="header">
            <h2>My Gameplay Videos</h2>
            <NavLink to="/add-video" className="add-btn">
              <FaPlus /> Add Video
            </NavLink>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid">
              {filteredVideos.map((video) => {
                const isLiked = video.likes.includes(currentUserId);

                return (
                  <div className="card" key={video._id}>
                    <img
                      src={video.thumbnail}
                      className="thumb"
                      onClick={() => setActiveVideo(video.videoUrl)}
                    />

                    <div className="card-body">
                      <div className="title">{video.title}</div>

                      <div className="stats">
                        <span>👁 {video.views || 0}</span>

                        <span
                          className={`like ${isLiked ? "liked" : ""}`}
                          onClick={() => likeVideo(video._id)}
                        >
                          <FaHeart /> {video.likes.length}
                        </span>

                        <span>
                          <FaCommentAlt /> {video.commentsCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {activeVideo && (
        <div className="video-modal" onClick={() => setActiveVideo(null)}>
          <video src={activeVideo} controls autoPlay />
        </div>
      )}
    </>
  );
};

export default Dashboard;
