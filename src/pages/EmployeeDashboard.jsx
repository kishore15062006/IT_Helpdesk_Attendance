import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/css/EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const [profile, setProfile] = useState(storedUser || {});

  useEffect(() => {
    if (!storedUser || storedUser.role !== "employee") {
      navigate("/login");
    }
  }, [storedUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser"); 
    navigate("/login");
  };

  const handleSave = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.map((user) =>
      user.id === profile.id ? profile : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("loggedInUser", JSON.stringify(profile));

    alert("Profile updated successfully");
    setIsDrawerOpen(false);
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
          <input type="text" value={profile.gender} disabled />

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
