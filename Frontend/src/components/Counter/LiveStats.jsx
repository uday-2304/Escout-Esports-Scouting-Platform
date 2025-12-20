import React from "react";
import CountUp from "react-countup";
import "./LiveStats.css"; // 👈 Import the CSS file

const LiveStats = () => {
  const stats = [
    { label: "Players Registered", value: 1200, suffix: "+" },
    { label: "Scouts Active", value: 70, suffix: "+" },
    { label: "Teams Recruiting", value: 25, suffix: "+" },
  ];

  return (
    <section className="live-stats">
      <h2 className="live-stats-title">
        Global e-Sports Community Growing Fast 🚀
      </h2>

      <div className="live-stats-grid">
        {stats.map((item, index) => (
          <div key={index} className="live-stats-card">
            <h3 className="live-stats-number">
              <CountUp
                end={item.value}
                duration={3.0}
                separator=","
                suffix={item.suffix}
              />
            </h3>
            <p className="live-stats-label">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LiveStats;
