import React, { useEffect, useState } from "react";
import "./AdminHome.css";
import API from "./api";
import logo from "./assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function AdminStudents() {
  const [admin, setAdmin] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userIssues, setUserIssues] = useState([]);
  const [showModal, setShowModal] = useState(false); // ✅ NEW

  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("adminUser");
    if (!data) {
      navigate("/admin-login");
      return;
    }
    setAdmin(JSON.parse(data));
    loadStudents();
  }, []);

  // Load students
  const loadStudents = async () => {
    try {
      const res = await fetch(`${API}/issues/all`);
      const text = await res.text();

      let allIssues = [];
      try {
        allIssues = JSON.parse(text);
      } catch {
        console.log("Invalid JSON:", text);
        return;
      }

      const map = new Map();
      allIssues.forEach((issue) => {
        if (!map.has(issue.enrollment)) {
          map.set(issue.enrollment, {
            name: issue.studentName,
            enrollment: issue.enrollment,
          });
        }
      });

      setStudents(Array.from(map.values()));
    } catch (err) {
      console.log("Error loading student list:", err);
    }
  };

  // Load issues for selected student
  const loadIssuesForStudent = async (enrollment) => {
    setSelectedUser(enrollment);
    try {
      const res = await fetch(`${API}/issues/all`);
      const text = await res.text();

      let allIssues = [];
      try {
        allIssues = JSON.parse(text);
      } catch {
        console.log("Invalid JSON:", text);
        return;
      }

      const filtered = allIssues.filter((i) => i.enrollment === enrollment);
      setUserIssues(filtered);
    } catch (err) {
      console.log("Error loading issues:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  return (
    <div className="admin-dashboard">

      {/* TOPBAR */}
      <div className="admin-topbar">
        <img src={logo} alt="Logo" className="topbar-logo" />
        <h1 className="topbar-title">Student / Faculty Data</h1>

        <div className="admin-profile">
          <span>{admin?.name}</span>
        </div>
      </div>

      <div className="dashboard-body">

        {/* SIDEBAR */}
        <div className="sidebar">
          <button className="side-btn" onClick={() => navigate("/admin-home")}>Home</button>
          <button className="side-btn" onClick={() => navigate("/admin-view-issues")}>View Issues</button>
          <button className="side-btn" onClick={() => navigate("/admin-resolved")}>Resolved Issues</button>
          <button className="side-btn active" onClick={() => navigate("/admin-students")}>Student/Faculty Data</button>
          <button className="side-btn" onClick={() => navigate("/admin-suggestions")}>
            Suggestions
          </button>
           <button className="side-btn" onClick={() => navigate("/admin-laundry")}>🧺 Laundry</button>
          <button className="side-btn logout" onClick={handleLogout}>Logout</button>
        </div>

        {/* MAIN CONTENT */}
        <div className="main-content">

          <h2 className="section-title">
            Student / Faculty Records ({students.length})
          </h2>

          <div className="content-box">
            {students.length === 0 ? (
              <p>No students have submitted issues yet.</p>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {students.map((s) => (
                  <div
                    key={s.enrollment}
                    style={{
                      padding: 12,
                      background: "#fff",
                      borderRadius: 8,
                      boxShadow: "0 0 6px rgba(0,0,0,0.06)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>{s.name}</strong>
                      <div style={{ color: "#666", fontSize: 13 }}>
                        {s.enrollment}
                      </div>
                    </div>

                    <button
                      className="side-btn"
                      onClick={() => {
                        loadIssuesForStudent(s.enrollment);
                        setShowModal(true); // ✅ OPEN MODAL
                      }}
                    >
                      View Issues
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ✅ MODAL POPUP */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)} // click outside close
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
          >

            <div className="modal-header">
              <h3>Issues by: {selectedUser}</h3>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✖
              </button>
            </div>

            {userIssues.length === 0 ? (
              <p>No issues found.</p>
            ) : (
              <div className="modal-content">
                {userIssues.map((issue) => (
                  <div key={issue._id} className="issue-card">
                    <strong>{issue.category}</strong> — {issue.message}
                    <div className="issue-meta">
                      Status: {issue.status} •{" "}
                      {new Date(issue.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}