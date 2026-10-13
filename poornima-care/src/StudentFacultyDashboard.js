// src/StudentFacultyDashboard.js
import React, { useState, useEffect } from "react";
import "./StudentFacultyDashboard.css";
import logo from "./assets/logo.png";
import API from "./api";
import { useNavigate } from "react-router-dom";

export default function StudentFacultyDashboard() {
  const navigate = useNavigate();

  // User Details
  const student = JSON.parse(localStorage.getItem("studentUser"));
  const currentUser = student || { name: "Guest", username: "guest" };

  // Complaint Popup
  const [showComplaintPopup, setShowComplaintPopup] = useState(false);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [savingComplaint, setSavingComplaint] = useState(false);

  // Suggestion Popup
  const [showSuggestionPopup, setShowSuggestionPopup] = useState(false);
  const [suggestTitle, setSuggestTitle] = useState("");
  const [suggestDesc, setSuggestDesc] = useState("");
  const [savingSuggestion, setSavingSuggestion] = useState(false);

  // Complaints List
  const [complaints, setComplaints] = useState([]);

  // Image Preview Popup
  const [previewImage, setPreviewImage] = useState(null);

  // Load user complaints on mount
  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const res = await fetch(`${API}/issues/all`);
      const data = await res.json();

      const myComplaints = data.filter(
        (i) => i.enrollment === currentUser.username
      );

      setComplaints(myComplaints);
    } catch (err) {
      console.error("Complaint fetch error:", err);
    }
  };

  // Helper to map status text to CSS class
  const getStatusClass = (status) => {
    if (!status) return "";
    const s = status.toString().toLowerCase().trim();
    if (s.includes("pend")) return "status-pending";
    if (s.includes("resolv") || s.includes("closed") || s.includes("complete")) return "status-resolved";
    return ""; // unknown / other statuses
  };

  // ---------------------------------------------
  // Submit New Complaint
  // ---------------------------------------------
  const handleComplaintSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !category.trim()) {
      alert("Please fill all fields.");
      return;
    }

    setSavingComplaint(true);

    try {
      const formData = new FormData();
      formData.append("studentName", currentUser.name);
      formData.append("enrollment", currentUser.username);
      formData.append("title", title);
      formData.append("category", category);
      formData.append("message", description);
      if (file) formData.append("image", file);

      const res = await fetch(`${API}/issues/add`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("Complaint submitted successfully!");
        setTitle("");
        setDescription("");
        setCategory("");
        setFile(null);
        setShowComplaintPopup(false);
        loadComplaints();
      } else {
        alert("Complaint submission failed.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error submitting complaint.");
    }

    setSavingComplaint(false);
  };

  // ---------------------------------------------
  // Submit Suggestion
  // ---------------------------------------------
  const handleSuggestionSubmit = async (e) => {
    e.preventDefault();

    if (!suggestTitle.trim() || !suggestDesc.trim()) {
      alert("Please fill all fields.");
      return;
    }

    setSavingSuggestion(true);

    try {
      const res = await fetch(`${API}/suggestions/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: suggestTitle,
          description: suggestDesc,
          userName: currentUser.name,
          userId: currentUser.username,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Suggestion submitted successfully!");
        setSuggestTitle("");
        setSuggestDesc("");
        setShowSuggestionPopup(false);
      } else {
        alert("Suggestion submission failed.");
      }
    } catch (err) {
      console.error("Suggestion error:", err);
      alert("Server error.");
    }

    setSavingSuggestion(false);
  };

  // ---------------------------------------------
  // Logout
  // ---------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("studentUser");
    navigate("/", { replace: true });
  };

  return (
    <div className="sfdash-main">
      {/* TOP BAR */}
      <div className="sfdash-topbar">
        <img src={logo} alt="logo" className="sfdash-logo" />
        <h2>Poornima’s Care – Student Dashboard</h2>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* WELCOME */}
      <h2 className="welcome-user">
        Welcome, {currentUser.name || currentUser.username} 👋
      </h2>

      {/* MAIN CARDS */}
      <div className="sfdash-grid">
        <div className="sfdash-card">
          <h3>💬 Raise Complaint</h3>
          <p>
            Facing a campus or hostel problem? <br />
            Tell us here — we’re listening 👂
          </p>
          <button onClick={() => setShowComplaintPopup(true)}>🚀 Report Now</button>
        </div>

        <div className="sfdash-card">
          <h3>📝 Suggestions</h3>
          <p>
            Got an idea to make campus better? <br />
            Drop it here ✨
          </p>
          <button onClick={() => setShowSuggestionPopup(true)}>
            ✍️ Share Idea
          </button>

        </div>
        {/* ✅ Laundry */}
        <div className="sfdash-card">
          <h3>🧺 Laundry Status</h3>
          <p>
            Track your laundry progress <br />
            Real-time updates 📦
          </p>
          <button onClick={() => navigate("/laundry")}>
            🔍 Track Laundry
          </button>
        </div>
      </div>

      {/* COMPLAINT STATUS */}
      <h2 className="status-heading">📊 Complaint Status</h2>

      <div className="status-box">
        {complaints.length === 0 ? (
          <p className="no-data">❌ No complaints found</p>
        ) : (
          complaints.map((c, i) => (
            <div key={i} className="status-item">
              <p><strong>Message:</strong> {c.message}</p>
              <p><strong>Category:</strong> {c.category}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`status-badge ${getStatusClass(c.status)}`}
                  // fallback inline style for unknown statuses
                  style={
                    !getStatusClass(c.status)
                      ? { background: "#f3f4f6", color: "#333", border: "1px solid #e2e8f0" }
                      : {}
                  }
                  aria-label={`Status: ${c.status || "Unknown"}`}
                >
                  {c.status || "Unknown"}
                </span>
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {c.createdAt ? new Date(c.createdAt).toLocaleString() : "N/A"}
              </p>

              {/* VIEW IMAGE BUTTON */}
              {c.imageUrl ? (
                <button
                  style={{
                    marginTop: 8,
                    background: "#144293",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                  onClick={() =>
                    setPreviewImage(`${API}${c.imageUrl}`)
                  }
                >
                  View Image
                </button>
              ) : (
                <p style={{ color: "#999", marginTop: 5 }}>No Image Uploaded</p>
              )}

              <hr />
            </div>
          ))
        )}
      </div>

      {/* COMPLAINT POPUP */}
      {showComplaintPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Raise Complaint</h2>

            <form onSubmit={handleComplaintSubmit} encType="multipart/form-data">
              <input
                type="text"
                placeholder="Complaint Title"
                className="popup-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label>Complaint Category</label>
              <select
                className="popup-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select category</option>
                <option value="Hostel">Hostel</option>
                <option value="Mess / Food">Mess / Food</option>
                <option value="Electricity">Electricity</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="WiFi / Internet">WiFi / Internet</option>
                <option value="Security">Security</option>
                <option value="Ragging">Ragging</option>
                <option value="Academics">Academics</option>
                <option value="Other">Other</option>
              </select>

              <textarea
                placeholder="Describe your complaint..."
                className="popup-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <div className="file-upload">
  <label className="file-label">📷 Upload Image (optional)</label>

  <div className="file-box" onClick={() => document.getElementById("fileInput").click()}>
    <input
      type="file"
      id="fileInput"
      accept="image/*"
      onChange={(e) => setFile(e.target.files[0] || null)}
    />
    <span className="file-text">
      {file ? file.name : "No file chosen"}
    </span>
  </div>
</div>

              <button type="submit" className="submit-btn" disabled={savingComplaint}>
                {savingComplaint ? "Submitting..." : "Submit"}
              </button>

              <button
                type="button"
                className="close-btn"
                onClick={() => setShowComplaintPopup(false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUGGESTION POPUP */}
      {showSuggestionPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Give Suggestion</h2>

            <form onSubmit={handleSuggestionSubmit}>
              <input
                type="text"
                placeholder="Suggestion Title"
                className="popup-input"
                value={suggestTitle}
                onChange={(e) => setSuggestTitle(e.target.value)}
                required
              />

              <textarea
                placeholder="Describe your suggestion..."
                className="popup-textarea"
                value={suggestDesc}
                onChange={(e) => setSuggestDesc(e.target.value)}
                required
              />

              <button type="submit" className="submit-btn" disabled={savingSuggestion}>
                {savingSuggestion ? "Submitting..." : "Submit"}
              </button>

              <button
                type="button"
                className="close-btn"
                onClick={() => setShowSuggestionPopup(false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FULL SCREEN IMAGE PREVIEW */}
      {previewImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
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
