import React, { useState } from "react";
import "./StudentFacultyLogin.css";
import logo from "./assets/logo.png";

import loginData from "./loginData";
import { useNavigate } from "react-router-dom";

export default function StudentFacultyLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const user = loginData.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // ✅ SAVE USER INFO FOR DASHBOARD
      localStorage.setItem("studentUser", JSON.stringify(user));

      alert(`Login Successful! Welcome ${user.name}`);
      navigate("/studentfaculty-dashboard");
    } else {
      alert("Invalid Username or Password");
    }
  };

  return (
    <div className="student-page">
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
        <h2>Student / Faculty Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
