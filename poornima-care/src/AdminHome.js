import React, { useEffect, useState } from "react";
import "./AdminHome.css";
import logo from "./assets/logo.png";
import { useNavigate } from "react-router-dom";
import API from "./api";

export default function AdminHome() {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({ pending: 0, resolved: 0, total: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("adminUser");
    if (!data) {
      navigate("/admin-login");
      return;
    }

    setAdmin(JSON.parse(data));
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/issues/all`);
      const text = await res.text();

      let issues = [];
      try {
        issues = JSON.parse(text);
      } catch {
        console.log("Invalid JSON received");
      }

      const pending = issues.filter((i) => i.status === "Pending").length;
      const resolved = issues.filter((i) => i.status === "Resolved").length;

      setStats({
        pending,
        resolved,
        total: issues.length,
      });

      const sorted = [...issues]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setRecent(sorted);
    } catch (err) {
      console.log("Error loading stats:", err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/");
  };

  return (
    <div className="admin-dashboard">

      {/* 🔷 TOPBAR */}
      <div className="admin-topbar">
        <div className="top-left">
          <img src={logo} alt="Logo" className="admin-logo" />
        </div>

        <h1 className="admin-title">Admin Dashboard</h1>

        <div className="top-right">
          👤 <span className="admin-right-name">{admin?.name}</span>
        </div>
      </div>

      {/* 🔷 MAIN */}
      <div className="dashboard-body">

        {/* 🔷 SIDEBAR */}
        <div className="sidebar">
          <button className="side-btn active" onClick={() => navigate("/admin-home")}>🏠 Home</button>
          <button className="side-btn" onClick={() => navigate("/admin-view-issues")}>📋 View Issues</button>
          <button className="side-btn" onClick={() => navigate("/admin-resolved")}>✅ Resolved</button>
          <button className="side-btn" onClick={() => navigate("/admin-students")}>🎓 Students</button>
          <button className="side-btn" onClick={() => navigate("/admin-suggestions")}>💡 Suggestions</button>
          <button className="side-btn" onClick={() => navigate("/admin-laundry")}>🧺 Laundry</button>

          <button className="side-btn logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        {/* 🔷 CONTENT */}
        <div className="main-content">

          <h2 className="section-title-center">
            Welcome, <span className="highlight-name">{admin?.name}</span>
          </h2>

          {/* 🔷 STATS */}
          {!loading && (
            <div className="card-row">

              <div className="stat-card">
                <h3>⏳ Pending</h3>
                <p>{stats.pending}</p>
              </div>

              <div className="stat-card">
                <h3>✅ Resolved</h3>
                <p>{stats.resolved}</p>
              </div>

              <div className="stat-card">
                <h3>📊 Total</h3>
                <p>{stats.total}</p>
              </div>

            </div>
          )}

          {/* 🔷 RECENT */}
          <div className="content-box">
            <h3 className="recent-title">📌 Recent Issue Reports</h3>

            {recent.length === 0 ? (
              <p>No recent issues found.</p>
            ) : (
              <div className="recent-list">
                {recent.map((i) => (
                  <div key={i._id} className="recent-item">
                    <div className="recent-main">
                      <strong>{i.studentName}</strong>
                      <span className="category">{i.category}</span>
                    </div>

                    <div className="recent-date">
                      {new Date(i.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              className="view-all-btn"
              onClick={() => navigate("/admin-view-issues")}
            >
              View All Issues →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}