import React, { useState } from "react";
import "./ArenaHub.css";
import { FaHeart, FaCommentAlt, FaPaperPlane } from "react-icons/fa";

const ArenaHub = () => {
  const [videos] = useState([
    {
      id: 1,
      title: "PUBG Pro Headshots Montage",
      user: "ShadowX",
      game: "PUBG",
      thumbnail: "https://i.ytimg.com/vi/ScMzIvxBSi4/maxresdefault.jpg",
      likes: 230,
      comments: 45,
    },
    {
      id: 2,
      title: "Valorant Insane Ace Clutch",
      user: "ReynaMain",
      game: "Valorant",
      thumbnail: "https://i.ytimg.com/vi/1os0G7Z5bX0/maxresdefault.jpg",
      likes: 350,
      comments: 60,
    },
    {
      id: 3,
      title: "Free Fire 25 Kill Match",
      user: "BlazeFF",
      game: "Free Fire",
      thumbnail: "https://i.ytimg.com/vi/7wtfhZwyrcc/maxresdefault.jpg",
      likes: 180,
      comments: 32,
    },
    {
      id: 4,
      title: "COD Sniper God Mode",
      user: "GhostCOD",
      game: "COD",
      thumbnail: "https://i.ytimg.com/vi/e-ORhEE9VVg/maxresdefault.jpg",
      likes: 270,
      comments: 41,
    },
  ]);

  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div className="arena-container">
      <h2 className="arena-heading">🏟️ Arena Hub</h2>
      <p className="arena-subtitle">
        Watch top gameplay highlights from gamers around the world, like and comment, or start a chat.
      </p>

      <div className="arena-grid">
        {videos.map((video) => (
          <button
            key={video.id}
            className="arena-card"
            onClick={() => setSelectedVideo(video)}
          >
            <img src={video.thumbnail} alt={video.title} className="arena-thumbnail" />
            <div className="arena-details">
              <h4>{video.title}</h4>
              <p className="uploader">@{video.user}</p>
              <div className="arena-stats">
                <span><FaHeart className="icon heart" /> {video.likes}</span>
                <span><FaCommentAlt className="icon comment" /> {video.comments}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="video-modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setSelectedVideo(null)}>✖</span>
            <h3>{selectedVideo.title}</h3>
            <p className="modal-user">@{selectedVideo.user}</p>
            <img src={selectedVideo.thumbnail} alt={selectedVideo.title} className="modal-img" />
            <div className="modal-actions">
              <button className="like-btn"><FaHeart /> Like</button>
              <button className="comment-btn"><FaCommentAlt /> Comment</button>
              <button className="chat-btn"><FaPaperPlane /> Chat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArenaHub;
