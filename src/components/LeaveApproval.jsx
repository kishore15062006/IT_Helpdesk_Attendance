import { useState } from "react";
import "../assets/css/LeaveApproval.css"

const LeaveApproval = () => {
  const [leaves, setLeaves] = useState(
    JSON.parse(localStorage.getItem("leaveRequests")) || []
  );

  const updateStatus = (id, status, comment) => {
    const updated = leaves.map((l) =>
      l.id === id ? { ...l, status, adminComment: comment } : l
    );

    setLeaves(updated);
    localStorage.setItem("leaveRequests", JSON.stringify(updated));
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
            <p>Status: {l.status}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default LeaveApproval;
