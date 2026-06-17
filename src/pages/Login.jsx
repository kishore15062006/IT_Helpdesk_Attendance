import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/login.css";

function LoginForm() {
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!role) {
      alert("Please select a role");
      return;
    }

    const username = usernameInputRef.current.value;
    const password = passwordInputRef.current.value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.length === 0) {
      alert("No users found. Please register first.");
      return;
    }

    const loggedUser = users.find(
      (user) =>
        user.username === username &&
        user.password === password &&
        user.role === role
    );

    if (!loggedUser) {
      alert("Invalid credentials or role. Please try again.");
      return;
    }

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole", loggedUser.role);
    localStorage.setItem("loggedInUser", JSON.stringify(loggedUser));

    alert(`${role.toUpperCase()} Login Successful`);

    if (role === "admin") {
      navigate("/adminDashboard", { replace: true });
    } else {
      navigate("/employeeDashboard", { replace: true });
    }

    usernameInputRef.current.value = "";
    passwordInputRef.current.value = "";
    setRole("");
  };

  return (
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
  );
}

export default LoginForm;
