import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/Registration.css";

const Registration = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    username: "",
    number: "",
    gender: "",
    role: "",
    password: "",
    confirmpassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmpassword) {
      alert("Password and Confirm Password do not match");
      return;
    }

    if (!form.role) {
      alert("Please select a role");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.some(
      (user) => user.email === form.email || user.username === form.username
    );

    if (userExists) {
      alert("User already exists");
      return;
    }

    const newUser = {
      id: Date.now(),
      email: form.email,
      username: form.username,
      number: form.number,
      gender: form.gender,
      role: form.role,
      password: form.password,
      attendance: [], 
      leaves: [],     
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration Successful");
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
  };

  return (
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
  );
};

export default Registration;
