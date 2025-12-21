import { useState } from "react";
import "../assets/css/TicketStyles.css";

const MyTickets = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const [tickets, setTickets] = useState(
    JSON.parse(localStorage.getItem("tickets")) || []
  );

  const myTickets = tickets.filter(
    (t) => t.raisedBy === loggedInUser.email
  );

  const deleteTicket = (id) => {
    if (!window.confirm("Delete this resolved ticket?")) return;

    const updated = tickets.filter((t) => t.id !== id);
    setTickets(updated);
    localStorage.setItem("tickets", JSON.stringify(updated));
  };

  if (myTickets.length === 0) {
    return (
      <div className="ticket-container">
        <h2>My Tickets</h2>
        <p className="empty-text">You have not raised any tickets</p>
      </div>
    );
  }

  return (
    <div className="ticket-container">
      <h2>My Tickets</h2>

      {myTickets.map((t) => (
        <div className="ticket-card" key={t.id}>
          <div className="ticket-header">
            <p><b>Issue:</b> {t.issueType}</p>
            <span className={`priority-badge ${t.priority.toLowerCase()}`}>
              {t.priority}
            </span>
          </div>

          <p className="ticket-description">{t.description}</p>

          <p>
            <b>Status:</b>{" "}
            <span className={`status ${t.status.toLowerCase()}`}>
              {t.status}
            </span>
          </p>

          {t.status === "Resolved" && (
            <button
              className="delete-btn"
              onClick={() => deleteTicket(t.id)}
            >
              Delete Ticket
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyTickets;
