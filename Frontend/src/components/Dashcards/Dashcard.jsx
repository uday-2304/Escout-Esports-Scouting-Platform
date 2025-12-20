import React, { useState } from "react";
import "./Dashcard.css";
import { FaHeart, FaCommentAlt, FaPlus } from "react-icons/fa";

const sampleVideos = [
  {
    id: 1,
    title: "Epic PUBG Headshots",
    game: "PUBG",
    thumbnail: "https://i.ytimg.com/vi/ScMzIvxBSi4/maxresdefault.jpg",
    likes: 230,
    comments: 45,
  },
  {
    id: 2,
    title: "Free Fire 20 Kill Streak!",
    game: "Free Fire",
    thumbnail: "https://i.ytimg.com/vi/7wtfhZwyrcc/maxresdefault.jpg",
    likes: 180,
    comments: 30,
  },
  {
    id: 3,
    title: "Valorant Ace Clutch",
    game: "Valorant",
    thumbnail: "https://i.ytimg.com/vi/1os0G7Z5bX0/maxresdefault.jpg",
    likes: 320,
    comments: 62,
  },
  {
    id: 4,
    title: "COD Warzone Victory",
    game: "COD",
    thumbnail: "https://i.ytimg.com/vi/e-ORhEE9VVg/maxresdefault.jpg",
    likes: 150,
    comments: 22,
  },
  {
    id: 5,
    title: "Fortnite Victory Royale",
    game: "Fortnite",
    thumbnail: "https://i.ytimg.com/vi/X2WH8mHJnhM/maxresdefault.jpg",
    likes: 410,
    comments: 73,
  },
];

const PlayerDashboard = () => {
  const [selectedGame, setSelectedGame] = useState("All");
  const games = ["All", "PUBG", "Free Fire", "Valorant", "COD", "Fortnite"];

  const filteredVideos =
    selectedGame === "All"
      ? sampleVideos
      : sampleVideos.filter((video) => video.game === selectedGame);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h2>🎮 My Gameplay Videos</h2>
        <button className="add-video-btn">
          <FaPlus /> Add Video
        </button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        {games.map((game) => (
          <button
            key={game}
            className={`filter-btn ${selectedGame === game ? "active" : ""}`}
            onClick={() => setSelectedGame(game)}
          >
            {game}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="video-grid">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <div key={video.id} className="video-card">
              <img src={video.thumbnail} alt={video.title} className="thumbnail" />
              <div className="video-info">
                <h4>{video.title}</h4>
                <p className="game-tag">{video.game}</p>
                <div className="stats">
                  <span>
                    <FaHeart className="icon heart" /> {video.likes}
                  </span>
                  <span>
                    <FaCommentAlt className="icon comment" /> {video.comments}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-videos">No videos found for {selectedGame}</p>
        )}
      </div>
    </div>
  );
};

export default PlayerDashboard;
