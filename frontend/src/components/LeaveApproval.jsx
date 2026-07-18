import { useState, useEffect } from "react";
import "../assets/css/LeaveApproval.css"
import { api } from "../services/api";
import { useTheme } from "../context/ThemeContext";

const LeaveApproval = () => {
  const [leaves, setLeaves] = useState([]);
  const { showNotification } = useTheme();

  const loadLeaves = async () => {
    try {
      const data = await api.getLeaveRequests();
      setLeaves(data || []);
    } catch (e) {
      console.error("Error loading leaves:", e);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const updateStatus = async (id, status, comment) => {
    try {
      await api.updateLeaveStatus(id, status, comment);
      showNotification(`Leave request ${status.toLowerCase()} successfully!`, "success");
      await loadLeaves();
    } catch (err) {
      showNotification(err.message || "Failed to update leave request status", "error");
    }
  };

  return (
    <div className="approval-container">
      <h3>Leave Approval</h3>

      {leaves.map((l) => (
        <div key={l.id} className="leave-card">
          <p><strong>{l.employeeName}</strong></p>
          <p>{l.fromDate} → {l.toDate}</p>
          <p>{l.leaveType}</p>
          <p>Reason: {l.reason}</p>

          {l.status === "PENDING" ? (
            <>
              <textarea
                placeholder="Admin comment"
                onChange={(e) => (l._comment = e.target.value)}
              />
              <button onClick={() => updateStatus(l.id, "APPROVED", l._comment || "")}>
                Approve
              </button>
              <button onClick={() => updateStatus(l.id, "REJECTED", l._comment || "")}>
                Reject
              </button>
            </>
          ) : (
            <p>Status: <span className={`status-pill ${l.status.toLowerCase()}`}>{l.status}</span></p>
          )}
        </div>
      ))}
    </div>
  );
};

export default LeaveApproval;
