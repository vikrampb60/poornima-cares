import React, { useState } from "react";
import "./LaundryPage.css";
import API from "./api";
import bgImage from "./assets/laundry-bg.jpg";

function LaundryPage() {
  const [bagId, setBagId] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const steps = ["collected", "washing", "ironing", "ready"];

  const stepIcons = {
    collected: "🧺",
    washing: "🧼",
    ironing: "👕",
    ready: "📦",
  };

  // ✅ SAFE STUDENT HANDLER
  const getStudentName = (student) => {
    if (!student) return "N/A";
    if (typeof student === "object") return student.name || "N/A";
    return student;
  };

  const fetchLaundry = async () => {
    if (!bagId) {
      alert("Enter Bag ID");
      return;
    }

    try {
      const res = await fetch(`${API}/laundry/${bagId}`);
      const result = await res.json();

      console.log("TRACK DATA:", result);

      if (result.success) {
        setData(result.data);
        setError("");
      } else {
        setError("Bag not found");
        setData(null);
      }
    } catch (err) {
      setError("Server error");
    }
  };

  const currentStep = data ? steps.indexOf(data.status) : -1;

  return (
    <div
      className="laundry-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="laundry-split">

        {/* LEFT PANEL */}
        <div className="left-panel">
          <h2>🧺 Laundry Tracker</h2>
          <p className="subtitle">Track your laundry in real-time</p>

          <div className="bag-input">
            <input
              type="text"
              placeholder="Enter Bag ID"
              value={bagId}
              onChange={(e) => setBagId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchLaundry()}
            />
            <button onClick={fetchLaundry}>Track</button>
          </div>

          {error && <p className="error-text">{error}</p>}
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">

          {!data ? (
            <div className="empty-state">
              <h3>🔍 No Data</h3>
              <p>Enter a Bag ID to track laundry</p>
            </div>
          ) : (
            <>
              {/* 🔥 BAG INFO (UPDATED UI) */}
              <div className={`bag-box ${data.status}`}>

                <p>
                  <strong>Bag ID:</strong>
                  <span>{data.bagId}</span>
                </p>

                <p>
                  <strong>Owner:</strong>
                  <span className="owner-name">
                    {getStudentName(data.student)}
                  </span>
                </p>

                <p>
                  <strong>Status:</strong>
                  <span>{data.status}</span>
                </p>

                <p className="date">
                  {new Date(data.updatedAt).toLocaleString()}
                </p>
              </div>

              {/* TRACKING */}
              <div className="tracking-line">

                {/* MOVING DOT */}
                <div
                  className="moving-dot"
                  style={{
                    left:
                      currentStep >= 0
                        ? `${(currentStep / (steps.length - 1)) * 100}%`
                        : "0%",
                  }}
                ></div>

                {/* PROGRESS BAR */}
                <div
                  className="progress-bar"
                  style={{
                    width:
                      currentStep >= 0
                        ? `${(currentStep / (steps.length - 1)) * 100}%`
                        : "0%",
                  }}
                ></div>

                {/* STEPS */}
                {steps.map((step, index) => (
                  <div key={index} className="step">
                    <div
                      className={`circle ${
                        index <= currentStep ? "active" : ""
                      }`}
                    >
                      {index < currentStep ? "✔" : stepIcons[step]}
                    </div>

                    <p
                      className={`label ${
                        index <= currentStep ? "active" : ""
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LaundryPage;