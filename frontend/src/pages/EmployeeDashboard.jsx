import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/css/EmployeeDashboard.css";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const EmployeeDashboard = () => {
  const { theme, toggleTheme, showNotification } = useTheme();
  const { user: authUser, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (authUser) {
      setProfile(authUser);
    }
  }, [authUser]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSave = async () => {
    try {
      await api.updateProfile(profile);
      await refreshUser();
      showNotification("Profile updated successfully", "success");
      setIsDrawerOpen(false);
    } catch (err) {
      showNotification(err.message || "Failed to update profile", "error");
    }
  };

  if (!profile || !profile.username) return null;

  return (
    <>
      <nav className="employee-navbar">
        <div className="nav-left">
          <div className="avatar" onClick={() => setIsDrawerOpen(true)}>
            {profile.username.charAt(0).toUpperCase()}
          </div>

          <span className="employee-name">{profile.username}</span>

          <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme" type="button">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="nav-links">
          <Link to="/employeeDashboard">Check In & Out</Link>
          <Link to="/employeeDashboard/raiseTicket">Raise Ticket</Link>
          <Link to="/employeeDashboard/myTickets">My Tickets</Link>
          <Link to="/employeeDashboard/leaveRequest">Leave Request</Link>
          <Link to="/employeeDashboard/attendanceReport">
            Attendance Report
          </Link>
          <Link to="/employeeDashboard/shiftsGiven">Shifts Given</Link>
        </div>
      </nav>

      {isDrawerOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      <div className={`profile-drawer ${isDrawerOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h3>Employee Profile</h3>
          <button onClick={() => setIsDrawerOpen(false)}>✕</button>
        </div>

        <div className="drawer-body">
          <label>Name</label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
          />

          <label>Email</label>
          <input type="email" value={profile.email} disabled />

          <label>Phone Number</label>
          <input
            type="number"
            value={profile.number || ""}
            onChange={(e) =>
              setProfile({ ...profile, number: e.target.value })
            }
          />

          <label>Gender</label>
          <input type="text" value={profile.gender || ""} disabled />

          <label>Role</label>
          <input type="text" value={profile.role} disabled />
        </div>

        <div className="drawer-footer">
          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>

      <div className="employee-content">
        <Outlet />
      </div>
    </>
  );
};

export default EmployeeDashboard;
