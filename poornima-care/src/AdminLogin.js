import React, { useState } from "react";
import "./AdminLogin.css";
import logo from "./assets/logo.png";

import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple Admin Login Check (You can replace with Firebase later)
    if (adminId === "admin" && password === "123") {
      localStorage.setItem(
        "adminUser",
        JSON.stringify({ name: "Admin", role: "Administrator" })
      );

      alert("Login Successful! Welcome Admin");
      navigate("/admin-home");
    } else {
      alert("Invalid Admin ID or Password");
    }
  };

  return (
    <div className="admin-page">
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
          <p className="topbar-subtitle">Campus/Hostel Issues &amp; Suggestion Portal</p>
        </div>

        <button
          className="topbar-button"
          onClick={() => window.open("https://poornima.edu.in/", "_blank")}
        >
          Main website
        </button>
      </div>

      <div className="login-box">
        <h2>Admin Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Admin ID"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-submit-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
