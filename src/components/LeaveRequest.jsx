import { useState } from "react";
import "../assets/css/LeaveRequest.css"
const LeaveRequest = () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [leaveType, setLeaveType] = useState("Casual");
  const [reason, setReason] = useState("");

  const handleApplyLeave = () => {
    if (!fromDate || !toDate || !reason) {
      alert("Please fill all fields");
      return;
    }

    const leaveRequests =
      JSON.parse(localStorage.getItem("leaveRequests")) || [];

    const newLeave = {
      id: Date.now(),
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

    localStorage.setItem(
      "leaveRequests",
      JSON.stringify([...leaveRequests, newLeave])
    );

    alert("Leave applied successfully");

    setFromDate("");
    setToDate("");
    setReason("");
  };

  const myLeaves = (JSON.parse(localStorage.getItem("leaveRequests")) || [])
    .filter((l) => l.employeeEmail === user.email);

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
          <h4>Pending</h4>
          {myLeaves.filter(l => l.status === "PENDING").map(l => (
            <p key={l.id}>{l.fromDate} → {l.toDate}</p>
          ))}
        </div>

        <div className="decision">
          <h4>Approved / Rejected</h4>
          {myLeaves.filter(l => l.status !== "PENDING").map(l => (
            <div key={l.id}>
              <p>
                {l.fromDate} → {l.toDate} ({l.status})
              </p>
              <small>Comment: {l.adminComment}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
