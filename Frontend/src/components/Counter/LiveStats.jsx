import React from "react";
import CountUp from "react-countup";
import "./LiveStats.css";

const LiveStats = () => {
  const stats = [
    { label: "Players Registered", value: 1200, suffix: "+" },
    { label: "Scouts Active", value: 70, suffix: "+" },
    { label: "Teams Recruiting", value: 25, suffix: "+" },
  ];

  return (
    <section className="live-stats">
      <div className="live-stats-content">
        <h2 className="live-stats-title">
          Community <span>Growth</span>
        </h2>

        <div className="live-stats-grid">
          {stats.map((item, index) => (
            <div key={index} className="live-stats-card">
              {/* Optional: Add icon here if desired */}
              
              <h3 className="live-stats-number">
                <CountUp
                  start={0}
                  end={item.value}
                  duration={3.5}
                  separator=","
                  suffix={item.suffix}
                  enableScrollSpy={true} // Animates when scrolled into view
                  scrollSpyOnce={true}
                />
              </h3>
              <p className="live-stats-label">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveStats;