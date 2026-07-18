import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/Registration.css";
import { api } from "../services/api";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Registration = () => {
  const navigate = useNavigate();
  const { showNotification, theme, toggleTheme } = useTheme();
  const { isAuthenticated, role: userRole, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (userRole === "admin") {
        navigate("/adminDashboard", { replace: true });
      } else {
        navigate("/employeeDashboard", { replace: true });
      }
    }
  }, [loading, isAuthenticated, userRole, navigate]);

  const [form, setForm] = useState({
    email: "",
    username: "",
    number: "",
    gender: "",
    role: "",
    password: "",
    confirmpassword: "",
  });

  if (loading || isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: 'var(--text-primary)',
        background: 'var(--bg-primary)'
      }}>
        Loading...
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmpassword) {
      showNotification("Password and Confirm Password do not match", "error");
      return;
    }

    if (!form.role) {
      showNotification("Please select a role", "error");
      return;
    }

    const newUser = {
      email: form.email,
      username: form.username,
      number: form.number,
      gender: form.gender,
      role: form.role,
      password: form.password,
    };

    try {
      await api.register(newUser);
      showNotification("Registration Successful", "success");
      navigate("/login");

      // Clear form
      setForm({
        email: "",
        username: "",
        number: "",
        gender: "",
        role: "",
        password: "",
        confirmpassword: "",
      });
    } catch (err) {
      showNotification(err.message || "Registration failed. Try again.", "error");
    }
  };

  return (
    <>
      <button className="theme-floating-btn" onClick={toggleTheme} type="button" aria-label="Toggle Theme">
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
      <form onSubmit={handleSubmit} className="registration-form">
      <h1>Registration</h1>

      <select
        name="role"
        id="role"
        value={form.role}
        onChange={handleChange}
        required
      >
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="employee">Employee</option>
      </select>

      <input
        type="email"
        name="email"
        id="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="username"
        id="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="number"
        id="number"
        placeholder="Phone Number"
        value={form.number}
        onChange={handleChange}
      />

      <div className="gender">
        <label>
          <input
            className="radiobtn"
            type="radio"
            name="gender"
            value="male"
            checked={form.gender === "male"}
            onChange={handleChange}
          />{" "}
          Male
        </label>
        <label>
          <input
            className="radiobtn"
            type="radio"
            name="gender"
            value="female"
            checked={form.gender === "female"}
            onChange={handleChange}
          />{" "}
          Female
        </label>
      </div>

      <input
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="confirmpassword"
        id="confirmpassword"
        placeholder="Confirm Password"
        value={form.confirmpassword}
        onChange={handleChange}
        required
      />

      <button type="submit" id="register-btn">Register</button>
      <br />
      <Link className="login-link" to="/login">
        Already registered? Login here
      </Link>
    </form>
    </>
  );
};

export default Registration;
