import React, { useEffect, useState } from "react";
import "./AdminHome.css";
import logo from "./assets/logo.png";
import { useNavigate } from "react-router-dom";
import API from "./api";

export default function AdminViewIssues() {
  const [admin, setAdmin] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [previewImage, setPreviewImage] = useState(null);

  // ✅ NEW STATE (Message Popup)
  const [selectedMessage, setSelectedMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("adminUser");
    if (!data) {
      navigate("/admin-login");
      return;
    }
    try {
      setAdmin(JSON.parse(data));
    } catch {
      setAdmin({ name: "Admin" });
    }
    loadIssues();
    // eslint-disable-next-line
  }, []);

  // Load Issues
  const loadIssues = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/issues/all`);
      const text = await res.text();

      let parsed = [];
      try {
        parsed = JSON.parse(text);
      } catch {
        console.warn("Invalid JSON from server:", text);
      }

      setIssues(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.error("Error loading issues:", err);
      setIssues([]);
    }
    setLoading(false);
  };

  // Mark issue as resolved
  const updateStatus = async (id) => {
    try {
      const res = await fetch(`${API}/issues/update-status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Resolved" }),
      });
      const data = await res.json();
      if (data.success) {
        loadIssues();
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("Server error while updating status.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/");
  };

  const filteredIssues = issues.filter((i) =>
    [i.studentName, i.enrollment, i.category]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      {/* TOP BAR */}
      <div className="admin-topbar">
        <img
          src={logo}
          alt="Logo"
          className="topbar-logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />

        <h1 className="topbar-title">View Issues</h1>

        <div className="admin-profile">
          <span className="admin-name">{admin?.name}</span>
        </div>
      </div>

      <div className="dashboard-body">
        {/* SIDEBAR */}
        <div className="sidebar">
          <button className="side-btn" onClick={() => navigate("/admin-home")}>Home</button>
          <button className="side-btn active" onClick={() => navigate("/admin-view-issues")}>View Issues</button>
          <button className="side-btn" onClick={() => navigate("/admin-resolved")}>Resolved Issues</button>
          <button className="side-btn" onClick={() => navigate("/admin-students")}>Student/Faculty Data</button>
          <button className="side-btn" onClick={() => navigate("/admin-suggestions")}>Suggestions</button>
           <button className="side-btn" onClick={() => navigate("/admin-laundry")}>🧺 Laundry</button>
          <button className="side-btn logout" onClick={handleLogout}>Logout</button>
        </div>

        {/* MAIN CONTENT */}
        <div className="main-content">
          <h2 className="section-title">All Issue Reports</h2>

          {/* Search */}
          <div className="content-box" style={{ marginBottom: 15 }}>
            <input
              type="text"
              placeholder="Search by name / enrollment / category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: 15,
              }}
            />
          </div>

          {/* Table */}
          <div className="content-box" style={{ overflowX: "auto" }}>
            {loading ? (
              <p>Loading issues...</p>
            ) : (
              <table className="issue-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Enrollment</th>
                    <th>Category</th>
                    <th>Message</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th>Action</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredIssues.length > 0 ? (
                    filteredIssues.map((i) => (
                      <tr key={i._id || i.id}>
                        <td>{i.studentName}</td>
                        <td>{i.enrollment}</td>
                        <td>{i.category}</td>

                        {/* ✅ MESSAGE CLICKABLE */}
                        <td
                          className="message-cell clickable"
                          onClick={() => setSelectedMessage(i.message)}
                        >
                          {i.message.length > 50
                            ? i.message.substring(0, 50) + "..."
                            : i.message}
                        </td>

                        {/* IMAGE */}
                        <td>
                          {i.imageUrl ? (
                            <img
                              src={
                                i.imageUrl.startsWith("http")
                                  ? i.imageUrl
                                  : `http://localhost:5000${i.imageUrl}`
                              }
                              alt="Issue"
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: 6,
                                cursor: "pointer",
                                border: "1px solid #ccc",
                                
                              }}
                              onClick={() =>
                                setPreviewImage(
                                  i.imageUrl.startsWith("http")
                                    ? i.imageUrl
                                    : `http://localhost:5000${i.imageUrl}`
                                )
                              }
                            />
                          ) : (
                            <span style={{ color: "#777" }}>No Image</span>
                          )}
                        </td>

                        {/* STATUS */}
                        <td>
                          {i.status === "Pending" ? (
                            <span className="pending-status">Pending</span>
                          ) : (
                            <span className="resolved-status">Resolved</span>
                          )}
                        </td>

                        {/* ACTION */}
                        <td>
                          {i.status === "Pending" ? (
                            <button
                              className="resolve-btn"
                              onClick={() => updateStatus(i._id)}
                            >
                              Mark Resolved
                            </button>
                          ) : (
                            <span className="resolved-badge">✓ Resolved</span>
                          )}
                        </td>

                        <td>
                          {i.createdAt
                            ? new Date(i.createdAt).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center", padding: 20 }}>
                        No issues found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* IMAGE PREVIEW POPUP */}
      {previewImage && (
        <div
          className="popup-overlay"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 10,
            }}
          />
        </div>
      )}

      {/* ✅ MESSAGE POPUP */}
      {selectedMessage && (
        <div
          className="popup-overlay"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="message-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Message</h3>
            <p>{selectedMessage}</p>

            <button onClick={() => setSelectedMessage(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}