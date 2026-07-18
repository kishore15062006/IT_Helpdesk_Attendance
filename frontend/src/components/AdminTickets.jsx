import { useState, useEffect } from "react";
import "../assets/css/TicketStyles.css";
import { api } from "../services/api";

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [localChanges, setLocalChanges] = useState({}); // id -> { status, adminComment }
  const [popup, setPopup] = useState({ show: false, message: "", type: "success" });

  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const loadTickets = async () => {
    try {
      const data = await api.getTickets();
      setTickets(data || []);
    } catch (e) {
      console.error("Error loading tickets:", e);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const updateTicket = async (id, updates) => {
    try {
      await api.updateTicket(id, updates);
      await loadTickets();
      showPopup("Ticket updated successfully!", "success");
    } catch (err) {
      showPopup(err.message || "Failed to update ticket", "error");
    }
  };

  const hideTicketForAdmin = async (id) => {
    try {
      await api.hideTicket(id);
      showPopup("Ticket deleted/hidden successfully!", "success");
      await loadTickets();
    } catch (err) {
      showPopup(err.message || "Failed to hide/delete ticket", "error");
    }
  };

  const handleStatusChange = (id, status) => {
    setLocalChanges((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        status,
      },
    }));
  };

  const handleCommentChange = (id, adminComment) => {
    setLocalChanges((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        adminComment,
      },
    }));
  };

  const handleSubmitChange = async (id, currentStatus, currentComment) => {
    const changes = localChanges[id] || {};
    const status = changes.status !== undefined ? changes.status : currentStatus;
    const adminComment = changes.adminComment !== undefined ? changes.adminComment : (currentComment || "");
    
    await updateTicket(id, { status, adminComment });
    
    // Clear local modifications tracking for this ticket
    setLocalChanges((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const visibleTickets = tickets.filter((t) => !t.adminHidden);

  if (visibleTickets.length === 0) {
    return (
      <div className="ticket-container">
        {popup.show && (
          <div className={`custom-popup-toast ${popup.type}`}>
            <div className="popup-icon">{popup.type === "success" ? "✓" : "✕"}</div>
            <div className="popup-message">{popup.message}</div>
          </div>
        )}
        <h2>Support Tickets</h2>
        <p className="empty-text">No tickets available</p>
      </div>
    );
  }

  return (
    <div className="ticket-container">
      {popup.show && (
        <div className={`custom-popup-toast ${popup.type}`}>
          <div className="popup-icon">{popup.type === "success" ? "✓" : "✕"}</div>
          <div className="popup-message">{popup.message}</div>
        </div>
      )}
      <h2>Support Tickets</h2>

      {visibleTickets.map((t) => {
        const changes = localChanges[t.id] || {};
        const statusVal = changes.status !== undefined ? changes.status : t.status;
        const commentVal = changes.adminComment !== undefined ? changes.adminComment : (t.adminComment || "");

        return (
          <div className="ticket-card" key={t.id}>
            <div className="ticket-header">
              <p><b>User:</b> {t.username}</p>
              <span className={`priority-badge ${t.priority.toLowerCase()}`}>
                {t.priority}
              </span>
            </div>

            <p><b>Issue Type:</b> {t.issueType}</p>

            <p className="ticket-description">
              <b>Description:</b><br />
              {t.description}
            </p>

            <div className="admin-controls">
              <select
                value={statusVal}
                onChange={(e) => handleStatusChange(t.id, e.target.value)}
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>

              <textarea
                placeholder="Admin comment..."
                value={commentVal}
                onChange={(e) => handleCommentChange(t.id, e.target.value)}
              />

              <div className="action-buttons-row">
                <button
                  className="ticket-submit-btn"
                  onClick={() => handleSubmitChange(t.id, t.status, t.adminComment)}
                >
                  Submit
                </button>
                <button
                  className="ticket-delete-btn"
                  onClick={() => hideTicketForAdmin(t.id)}
                >
                  Delete Ticket
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminTickets;
