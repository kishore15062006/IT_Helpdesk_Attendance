import { useState, useEffect } from "react";
import "../assets/css/LeaveRequest.css"
import { api } from "../services/api";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const LeaveRequest = () => {
  const { user } = useAuth();
  const { showNotification } = useTheme();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [leaveType, setLeaveType] = useState("Casual");
  const [reason, setReason] = useState("");
  const [myLeaves, setMyLeaves] = useState([]);

  const loadMyLeaves = async () => {
    if (!user) return;
    try {
      const data = await api.getUserLeaveRequests(user.email);
      setMyLeaves(data || []);
    } catch (e) {
      console.error("Error loading leaves:", e);
    }
  };

  useEffect(() => {
    loadMyLeaves();
  }, [user?.email]);

  const handleApplyLeave = async () => {
    if (!fromDate || !toDate || !reason) {
      showNotification("Please fill all fields", "error");
      return;
    }

    const newLeave = {
      employeeName: user.username,
      employeeEmail: user.email,
      fromDate,
      toDate,
      leaveType,
      reason,
      status: "PENDING",
      adminComment: "",
      appliedAt: new Date().toLocaleString(),
    };

    try {
      await api.applyLeave(newLeave);
      showNotification("Leave applied successfully", "success");
      setFromDate("");
      setToDate("");
      setReason("");
      await loadMyLeaves();
    } catch (err) {
      showNotification(err.message || "Failed to apply leave", "error");
    }
  };

  return (
    <div className="leave-container">
      <div className="leave-apply">
        <h3>Apply Leave</h3>

        <label>From</label>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />

        <label>To</label>
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />

        <label>Leave Type</label>
        <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
          <option>Casual</option>
          <option>Sick</option>
          <option>Earned</option>
        </select>

        <label>Reason</label>
        <textarea
          placeholder="Enter reason for leave"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <button onClick={handleApplyLeave}>Apply Leave</button>
      </div>

      <div className="leave-status">
        <div className="pending">
          <h4>Pending Requests</h4>
          {myLeaves.filter(l => l.status === "PENDING").map(l => (
            <div className="pending-card" key={l.id}>
              <span className="date-range">{l.fromDate} &rarr; {l.toDate}</span>
              <span className="status-pill pending">{l.status}</span>
            </div>
          ))}
        </div>

        <div className="decision">
          <h4>Approved / Rejected</h4>
          {myLeaves.filter(l => l.status !== "PENDING").map(l => (
            <div className="decision-card" key={l.id}>
              <p>
                <span className="date-range">{l.fromDate} &rarr; {l.toDate}</span>
                <span className={`status-pill ${l.status.toLowerCase()}`}>{l.status}</span>
              </p>
              {l.adminComment && <small className="admin-comment">Comment: {l.adminComment}</small>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
