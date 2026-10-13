// src/AdminResolved.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHome.css";
import API from "./api";
import logo from "./assets/logo.png";

export default function AdminResolved() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [resolved, setResolved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (!stored) {
      navigate("/admin-login");
      return;
    }
    try {
      setAdmin(JSON.parse(stored));
    } catch {
      setAdmin({ name: "Admin" });
    }
    loadResolved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadResolved = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/issues/resolved`);
      // try json first, fallback to text->json
      let data = [];
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch {
          console.warn("Could not parse resolved response:", text);
          data = [];
        }
      }
      setResolved(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Resolved fetch error:", err);
      setResolved([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/", { replace: true });
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleString();
    } catch {
      return date;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* TOP BAR */}
      <div className="admin-topbar">
        <img
          src={logo}
          alt="Logo"
          className="topbar-logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        />

        <h1 className="topbar-title">Resolved Issues</h1>

        {/* show admin name on right */}
        <div className="admin-profile">
          <span className="admin-name">{admin?.name}</span>
        </div>
      </div>

      {/* BODY */}
      <div className="dashboard-body">
        {/* SIDEBAR */}
        <div className="sidebar">
          <button className="side-btn" onClick={() => navigate("/admin-home")}>Home</button>
          <button className="side-btn" onClick={() => navigate("/admin-view-issues")}>View Issues</button>
          <button className="side-btn active" onClick={() => navigate("/admin-resolved")}>Resolved</button>
          <button className="side-btn" onClick={() => navigate("/admin-students")}>Student/Faculty Data</button>
          <button className="side-btn" onClick={() => navigate("/admin-suggestions")}>Suggestions</button>
 <button className="side-btn" onClick={() => navigate("/admin-laundry")}>🧺 Laundry</button>
          <button className="side-btn logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="main-content">
          <h2 className="section-title">Resolved Issues ({resolved.length})</h2>

          <div className="content-box">
            {loading ? (
              <p>Loading...</p>
            ) : resolved.length === 0 ? (
              <p>No resolved issues found.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {resolved.map((r) => (
                  <div
                    key={r._id || r.id}
                    style={{
                      padding: 12,
                      background: "#fff",
                      borderRadius: 8,
                      boxShadow: "0 0 6px rgba(0,0,0,0.08)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>{r.studentName}</strong> — {r.category}
                      <div style={{ color: "#666", fontSize: 13 }}>
                        {formatDate(r.createdAt)}
                      </div>
                    </div>

                    <button className="side-btn" onClick={() => setSelected(r)}>
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DETAILS MODAL */}
      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: 600,
              maxWidth: "96%",
              background: "#fff",
              borderRadius: 10,
              padding: 20,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <h3 style={{ margin: 0 }}>
                {selected.studentName} — {selected.category}
              </h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="side-btn" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>

            <p style={{ marginTop: 12 }}><strong>Message:</strong></p>
            <p style={{ whiteSpace: "pre-wrap" }}>{selected.message}</p>

            <p><strong>Status:</strong> {selected.status}</p>

            <p>
              <strong>Resolved On:</strong>{" "}
              {formatDate(selected.updatedAt || selected.createdAt)}
            </p>

            {/* IMAGE PREVIEW BUTTON */}
            {selected.imageUrl ? (
              <img
                src={selected.imageUrl.startsWith("http") ? selected.imageUrl : `http://localhost:5000${selected.imageUrl}`}
                alt="issue"
                style={{
                  marginTop: 12,
                  width: "100%",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
                onClick={() =>
                  setPreviewImage(selected.imageUrl.startsWith("http") ? selected.imageUrl : `http://localhost:5000${selected.imageUrl}`)
                }
              />
            ) : (
              <div
                style={{
                  marginTop: 12,
                  background: "#f7f7f7",
                  height: 160,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#555",
                }}
              >
                No Image
              </div>
            )}
          </div>
        </div>
      )}

      {/* FULL SCREEN IMAGE PREVIEW */}
      {previewImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999,
          }}
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 10,
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      )}
    </div>
  );
}
