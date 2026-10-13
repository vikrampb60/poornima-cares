import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import AdminLogin from "./AdminLogin";
import StudentFacultyLogin from "./StudentFacultyLogin";

import AdminHome from "./AdminHome";
import StudentFacultyDashboard from "./StudentFacultyDashboard";

import AdminViewIssues from "./AdminViewIssues";
import AdminResolved from "./AdminResolved";
import AdminStudents from "./AdminStudents";
import AdminViewSuggestions from "./AdminViewSuggestions";
import LaundryPage from "./LaundryPage"; 
import AdminLaundry from "./AdminLaundry";


import logo from "./assets/logo.png";
import "./App.css";

/* ================= HOME PAGE ================= */
function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-container">

      {/* ===== TOPBAR ===== */}
      <div className="topbar">
        <img
          src={logo}
          alt="Logo"
          className="topbar-logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        />

        <div className="topbar-title-block">
          <h1 className="topbar-title">Poornima’s Care</h1>
          <p className="topbar-subtitle">
            Campus/Hostel Issues & Suggestion Portal
          </p>
        </div>

        <button
          className="topbar-button"
          onClick={() => window.open("https://poornima.edu.in/", "_blank")}
        >
          Main website
        </button>
      </div>

      {/* ===== MAIN CARD ===== */}
      <div className="form-card">
        <h2 className="form-heading">Login Portal</h2>

        <button
          className="login-btn"
          onClick={() => navigate("/studentfaculty-login")}
        >
          Student / Faculty Login
        </button>

        <button
          className="login-btn"
          onClick={() => navigate("/admin-login")}
        >
          Admin Login
        </button>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        © {new Date().getFullYear()} Poornima’s Care | Poornima University Jaipur
      </footer>
    </div>
  );
}

/* ================= MAIN APP ================= */
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ===== HOME ===== */}
        <Route path="/" element={<HomePage />} />

        {/* ===== LOGIN ===== */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/studentfaculty-login" element={<StudentFacultyLogin />} />

        {/* ===== DASHBOARDS ===== */}
        <Route
          path="/studentfaculty-dashboard"
          element={<StudentFacultyDashboard />}
        />
        <Route path="/admin-home" element={<AdminHome />} />
<Route path="/laundry" element={<LaundryPage />} />
<Route path="/admin-laundry" element={<AdminLaundry />} />
        {/* ===== ADMIN ADVANCED ===== */}
        <Route path="/admin-view-issues" element={<AdminViewIssues />} />
        <Route path="/admin-resolved" element={<AdminResolved />} />
        <Route path="/admin-students" element={<AdminStudents />} />
        <Route path="/admin-suggestions" element={<AdminViewSuggestions />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;