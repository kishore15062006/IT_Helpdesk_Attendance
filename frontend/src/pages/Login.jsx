import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/login.css";
import { api } from "../services/api";
import { useTheme } from "../context/ThemeContext";

function LoginForm() {
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const { showNotification, theme, toggleTheme } = useTheme();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!role) {
      showNotification("Please select a role", "error");
      return;
    }

    const username = usernameInputRef.current.value;
    const password = passwordInputRef.current.value;

    try {
      const loginResponse = await api.login(username, password, role);

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", loginResponse.role);
      localStorage.setItem("jwtToken", loginResponse.token);
      
      const loggedUser = {
        id: loginResponse.id,
        username: loginResponse.username,
        email: loginResponse.email,
        role: loginResponse.role,
        number: loginResponse.number,
        gender: loginResponse.gender,
      };
      localStorage.setItem("loggedInUser", JSON.stringify(loggedUser));

      showNotification(`${role.toUpperCase()} Login Successful`, "success");

      if (role === "admin") {
        navigate("/adminDashboard", { replace: true });
      } else {
        navigate("/employeeDashboard", { replace: true });
      }

      usernameInputRef.current.value = "";
      passwordInputRef.current.value = "";
      setRole("");
    } catch (err) {
      showNotification(err.message || "Invalid credentials or role. Please try again.", "error");
    }
  };

  return (
    <>
      <button className="theme-floating-btn" onClick={toggleTheme} type="button" aria-label="Toggle Theme">
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
      <form onSubmit={handleSubmit} className="login-form">
      <h1>Login</h1>

      <div className="form-group">
        <label>Role:</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select role</option>
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          ref={usernameInputRef}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          ref={passwordInputRef}
          required
        />
      </div>

      <button type="submit" id="login-btn">Login</button>
      <br />
      <Link className="register-link" to="/register">
        New user? Register here
      </Link>
    </form>
    </>
  );
}

export default LoginForm;
