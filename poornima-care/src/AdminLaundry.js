import React, { useState, useEffect } from "react";
import "./AdminLaundry.css";
import API from "./api";

function AdminLaundry() {
  const [bagId, setBagId] = useState("");
  const [student, setStudent] = useState("");
  const [message, setMessage] = useState("");
  const [records, setRecords] = useState([]);

  // LOAD DATA
  const loadRecords = async () => {
    try {
      const res = await fetch(`${API}/laundry/all`);
      const data = await res.json();

      console.log("DATA:", data); // 🔍 DEBUG

      if (data.success) {
        setRecords(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  // ADD BAG
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bagId || !student) {
      alert("Enter all fields");
      return;
    }

    try {
      const res = await fetch(`${API}/laundry/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bagId,
          student, // sending string
          status: "collected",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("✅ Bag Added");
        setBagId("");
        setStudent("");
        loadRecords();
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  // UPDATE STATUS
  const updateStatus = async (bagId, newStatus) => {
    try {
      await fetch(`${API}/laundry/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bagId,
          status: newStatus,
        }),
      });

      loadRecords();
    } catch (err) {
      console.error(err);
    }
  };

  // 🧠 SAFE STUDENT NAME HANDLER
  const getStudentName = (student) => {
    if (!student) return "N/A";

    if (typeof student === "object") {
      return student.name || "N/A";
    }

    return student;
  };

  return (
    <div className="admin-laundry-container">
      <div className="admin-laundry-wrapper">

        <h2>🧺 Admin Laundry Panel</h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="form-row">
          <input
            type="text"
            placeholder="Enter Bag ID"
            value={bagId}
            onChange={(e) => setBagId(e.target.value)}
          />

          <input
            type="text"
            placeholder="Owner Name"
            value={student}
            onChange={(e) => setStudent(e.target.value)}
          />

          <button type="submit">➕ Add Bag</button>
        </form>

        {message && <p className="msg">{message}</p>}

        {/* RECORDS */}
        <div className="record-section">
          <h3>📦 Recent Laundry Records</h3>

          {records.length === 0 ? (
            <p>No records found</p>
          ) : (
            records.map((r) => (
              <div key={r._id} className={`record-row ${r.status}`}>

                <div>
                  <strong>Bag: {r.bagId}</strong><br />

                  {/* ✅ FIXED HERE */}
                  <span>
                    Owner: {getStudentName(r.student)}
                  </span><br />

                  <span className="status-text">
                    Status: {r.status}
                  </span><br />

                  <span className="date-text">
                    {new Date(r.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="btn-group">
                  <button onClick={() => updateStatus(r.bagId, "washing")}>
                    Washing
                  </button>

                  <button onClick={() => updateStatus(r.bagId, "ironing")}>
                    Ironing
                  </button>

                  <button onClick={() => updateStatus(r.bagId, "ready")}>
                    Ready
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminLaundry;