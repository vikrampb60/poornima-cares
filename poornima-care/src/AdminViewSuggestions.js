// src/AdminViewSuggestions.js
import React, { useEffect, useState } from "react";
import "./AdminHome.css"; 
import logo from "./assets/logo.png";
import { useNavigate } from "react-router-dom";
import API from "./api";

export default function AdminViewSuggestions() {
  const [admin, setAdmin] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("adminUser");
    if (!data) {
      navigate("/admin-login");
    } else {
      setAdmin(JSON.parse(data));
    }

    loadSuggestions();
  }, []);

  // ================= FETCH ALL SUGGESTIONS =================
  const loadSuggestions = async () => {
    try {
      const res = await fetch(`${API}/suggestions/all`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Error loading suggestions:", err);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/");
  };

  return (
    <div className="admin-dashboard">

      {/* TOPBAR */}
      <div className="admin-topbar">
        <img src={logo} alt="Logo" className="topbar-logo" />
        <h1 className="topbar-title">Suggestions</h1>

        {admin && <div className="admin-profile">{admin.name}</div>}
      </div>

      {/* BODY */}
      <div className="dashboard-body">

        {/* SIDEBAR */}
        <div className="sidebar">
          <button className="side-btn" onClick={() => navigate("/admin-home")}>Home</button>
          <button className="side-btn" onClick={() => navigate("/admin-view-issues")}>View Issues</button>
          <button className="side-btn" onClick={() => navigate("/admin-resolved")}>Resolved Issues</button>
          <button className="side-btn" onClick={() => navigate("/admin-students")}>Student/Faculty Data</button>
          <button className="side-btn active" onClick={() => navigate("/admin-suggestions")}>Suggestions</button>
 <button className="side-btn" onClick={() => navigate("/admin-laundry")}>🧺 Laundry</button>
          <button className="side-btn logout" onClick={handleLogout}>Logout</button>
        </div>

        {/* MAIN CONTENT */}
        <div className="main-content">
          <h2 className="section-title">All Suggestions</h2>

          <div className="content-box">
            <table className="issue-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>View</th>
                </tr>
              </thead>

              <tbody>
                {suggestions.length > 0 ? (
                  suggestions.map((s) => (
                    <tr key={s._id}>
                      <td>{s.title}</td>
                      <td>{s.description.slice(0, 40)}...</td>
                      <td>{s.userName}</td>
                      <td>{new Date(s.createdAt).toLocaleString()}</td>
                      <td>
                        <button className="side-btn" onClick={() => setSelected(s)}>
                          Open
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                      No suggestions submitted.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* POPUP VIEW */}
      {selected && (
        <div className="popup-overlay">
          <div className="popup-box" style={{ maxWidth: 600 }}>
            <h2>Suggestion Details</h2>

            <p><strong>Title:</strong> {selected.title}</p>
            <p><strong>Description:</strong> {selected.description}</p>
            <p><strong>User:</strong> {selected.userName}</p>
            <p><strong>Date:</strong> {new Date(selected.createdAt).toLocaleString()}</p>

            <button className="close-btn" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
