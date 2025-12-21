import { useState } from "react";
import "../assets/css/TicketStyles.css";

const AdminTickets = () => {
  const [tickets, setTickets] = useState(
    JSON.parse(localStorage.getItem("tickets")) || []
  );

  const updateTicket = (id, updates) => {
    const updated = tickets.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    );
    setTickets(updated);
    localStorage.setItem("tickets", JSON.stringify(updated));
  };

  const hideTicketForAdmin = (id) => {
    const updated = tickets.map((t) =>
      t.id === id ? { ...t, adminHidden: true } : t
    );
    setTickets(updated);
    localStorage.setItem("tickets", JSON.stringify(updated));
  };

  const visibleTickets = tickets.filter((t) => !t.adminHidden);

  if (visibleTickets.length === 0) {
    return (
      <div className="ticket-container">
        <h2>Support Tickets</h2>
        <p className="empty-text">No tickets available</p>
      </div>
    );
  }

  return (
    <div className="ticket-container">
      <h2>Support Tickets</h2>

      {visibleTickets.map((t) => (
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
              value={t.status}
              onChange={(e) =>
                updateTicket(t.id, { status: e.target.value })
              }
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>

            <textarea
              placeholder="Admin comment..."
              value={t.adminComment || ""}
              onChange={(e) =>
                updateTicket(t.id, { adminComment: e.target.value })
              }
            />

            {t.status === "Resolved" && (
              <button
                className="delete-btn"
                onClick={() => hideTicketForAdmin(t.id)}
              >
                Delete Ticket
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminTickets;
