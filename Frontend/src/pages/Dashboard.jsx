import React, { useEffect, useState } from "react";
import { 
  FaHeart, FaCommentAlt, FaPlay, FaGamepad, 
  FaSearch, FaBell, FaChevronDown, FaPlus 
} from "react-icons/fa";
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
    e.stopPropagation(); // Prevent card click
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
    <div style={styles.dashboardContainer}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;700&display=swap');
          
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: #555; }

          .hover-scale { transition: transform 0.3s ease, box-shadow 0.3s ease; }
          .hover-scale:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
          .hover-scale:hover .play-btn { opacity: 1; transform: scale(1); }
          .hover-text-bright:hover { color: #fff !important; }
        `}
      </style>

      {/* ===== SIDEBAR ===== */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}></div>
          <span style={styles.brandText}>ARCADER</span>
        </div>

        <nav style={styles.navContainer}>
          <p style={styles.navHeader}>DISCOVER</p>
          <div style={styles.filterGroup}>
            {games.map((g) => (
              <button
                key={g}
                style={selectedGame === g ? styles.navItemActive : styles.navItem}
                onClick={() => setSelectedGame(g)}
              >
                <FaGamepad size={14} style={{ opacity: selectedGame === g ? 1 : 0.5 }} />
                <span>{g}</span>
              </button>
            ))}
          </div>
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.rankWidget}>
            <span style={styles.rankLabel}>Rank</span>
            <span style={styles.rankValue}>Diamond II</span>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main style={styles.mainContent}>
        
        {/* TOP HEADER */}
        <header style={styles.header}>
          <div style={styles.searchWrapper}>
            <FaSearch color="#555" size={14} />
            <input type="text" placeholder="Search clips..." style={styles.searchInput} />
          </div>

          <div style={styles.headerActions}>
            <NavLink to="/add-video" style={styles.uploadBtn}>
              <FaPlus size={12} /> Upload
            </NavLink>
            <div style={styles.iconBtn}><FaBell size={16} /></div>
            <div style={styles.profileBadge}>
              <div style={styles.avatar}>P</div>
              <FaChevronDown size={10} color="#666" />
            </div>
          </div>
        </header>

        {/* HERO BANNER */}
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>Gaming Highlights</h1>
            <p style={styles.heroSub}>Discover the best plays from the community.</p>
          </div>
          <div style={styles.heroDecor}></div>
        </section>

        {/* CONTENT GRID */}
        <section style={styles.gridSection}>
          <div style={styles.sectionTitleRow}>
            <h2 style={styles.sectionTitle}>Trending Now</h2>
            <span style={styles.resultCount}>{filteredVideos.length} clips found</span>
          </div>

          {loading ? (
            <p style={styles.loading}>Loading stream...</p>
          ) : (
            <div style={styles.grid}>
              {filteredVideos.map((video) => {
                const isLiked = video.likes.includes(currentUserId);
                return (
                  <div key={video._id} style={styles.card} className="hover-scale">
                    {/* Thumbnail */}
                    <div style={styles.thumbWrapper} onClick={() => setActiveVideo(video.videoUrl)}>
                      <img src={video.thumbnail} alt={video.title} style={styles.thumb} />
                      <div style={styles.overlay}>
                        <div style={styles.playBtn} className="play-btn">
                          <FaPlay size={14} style={{ marginLeft: 2 }} />
                        </div>
                        <span style={styles.gameTag}>{video.game}</span>
                        <span style={styles.duration}>0:30</span>
                      </div>
                    </div>

                    {/* Meta */}
                    <div style={styles.cardMeta}>
                      <h3 style={styles.videoTitle}>{video.title}</h3>
                      <div style={styles.metaFooter}>
                        <span style={styles.views}>{video.views || 0} views</span>
                        
                        <div style={styles.actions}>
                          <button style={styles.actionBtn} onClick={(e) => likeVideo(video._id, e)}>
                            <FaHeart color={isLiked ? "#F43F5E" : "#666"} size={14} />
                            <span style={{ color: isLiked ? "#F43F5E" : "#666" }}>{video.likes.length}</span>
                          </button>
                          <div style={styles.actionBtn}>
                            <FaCommentAlt color="#666" size={12} />
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

      {/* VIDEO MODAL */}
      {activeVideo && (
        <div style={styles.modalOverlay} onClick={() => setActiveVideo(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <video src={activeVideo} controls autoPlay style={styles.videoPlayer} />
          </div>
        </div>
      )}
    </div>
  );
};

/* ===== MINIMALIST STYLES ===== */
const styles = {
  dashboardContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#09090b", // Very dark matte grey (not pure black)
    color: "#e4e4e7",
    fontFamily: "'Inter', sans-serif",
  },

  /* Sidebar */
  sidebar: {
    width: "240px",
    padding: "32px 24px",
    borderRight: "1px solid #27272a",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    height: "100vh",
    backgroundColor: "#09090b",
    zIndex: 20,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "48px",
  },
  brandIcon: {
    width: "24px",
    height: "24px",
    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", // Minimal gradient dot
    borderRadius: "6px",
  },
  brandText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    color: "#fff",
  },
  navHeader: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#52525b",
    marginBottom: "16px",
    letterSpacing: "1px",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    color: "#a1a1aa",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left",
  },
  navItemActive: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    background: "#18181b",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "left",
  },
  sidebarFooter: {
    marginTop: "auto",
  },
  rankWidget: {
    padding: "16px",
    background: "#121215",
    borderRadius: "12px",
    border: "1px solid #27272a",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rankLabel: { fontSize: "12px", color: "#71717a" },
  rankValue: { fontSize: "13px", color: "#fff", fontWeight: "600" },

  /* Main Content */
  mainContent: {
    flex: 1,
    marginLeft: "240px",
    padding: "32px 48px",
  },

  /* Header */
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "48px",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#121215",
    border: "1px solid #27272a",
    padding: "10px 16px",
    borderRadius: "100px",
    width: "320px",
    transition: "border-color 0.2s",
  },
  searchInput: {
    background: "transparent",
    border: "none",
    color: "#fff",
    width: "100%",
    outline: "none",
    fontSize: "13px",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#fff",
    color: "#000",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "100px",
    fontSize: "13px",
    fontWeight: "600",
    transition: "opacity 0.2s",
  },
  iconBtn: {
    color: "#a1a1aa",
    cursor: "pointer",
    transition: "color 0.2s",
  },
  profileBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  avatar: {
    width: "32px",
    height: "32px",
    background: "linear-gradient(to right, #8B5CF6, #EC4899)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "700",
    color: "#fff",
  },

  /* Hero */
  hero: {
    marginBottom: "40px",
    paddingBottom: "40px",
    borderBottom: "1px solid #27272a",
    position: "relative",
  },
  heroTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "32px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "8px",
    letterSpacing: "-1px",
  },
  heroSub: {
    fontSize: "14px",
    color: "#71717a",
  },
  heroDecor: {
    position: "absolute",
    top: "-100px",
    right: "-100px",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(0,0,0,0) 70%)",
    filter: "blur(40px)",
    zIndex: -1,
  },

  /* Grid Section */
  sectionTitleRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "12px",
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#fff",
  },
  resultCount: {
    fontSize: "12px",
    color: "#52525b",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "24px",
  },
  
  /* Card */
  card: {
    backgroundColor: "transparent", // Clean look, no card background until hover if desired
    borderRadius: "12px",
    cursor: "pointer",
  },
  thumbWrapper: {
    position: "relative",
    aspectRatio: "16/9",
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "12px",
    backgroundColor: "#18181b", // Skeleton color
  },
  thumb: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.3s",
  },
  playBtn: {
    width: "40px",
    height: "40px",
    background: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(4px)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    opacity: 0,
    transform: "scale(0.8)",
    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
  gameTag: {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(8px)",
    color: "#fff",
    fontSize: "10px",
    fontWeight: "600",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  duration: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    background: "rgba(0,0,0,0.8)",
    color: "#fff",
    fontSize: "10px",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  cardMeta: {
    padding: "0 4px",
  },
  videoTitle: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#e4e4e7",
    marginBottom: "8px",
    lineHeight: "1.4",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  metaFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  views: {
    fontSize: "12px",
    color: "#71717a",
  },
  actions: {
    display: "flex",
    gap: "12px",
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    color: "#71717a",
    padding: 0,
  },
  loading: {
    color: "#52525b",
    fontSize: "14px",
  },

  /* Modal */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    backdropFilter: "blur(12px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modalContent: {
    width: "80%",
    maxWidth: "1000px",
    aspectRatio: "16/9",
    background: "#000",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 0 40px rgba(0,0,0,0.5)",
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
  },
};

export default Dashboard;