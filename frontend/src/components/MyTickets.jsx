import { useState, useEffect } from "react";
import "../assets/css/TicketStyles.css";
import { api } from "../services/api";
import { useTheme } from "../context/ThemeContext";

const MyTickets = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const [myTickets, setMyTickets] = useState([]);
  const { showNotification } = useTheme();

  const loadMyTickets = async () => {
    if (!loggedInUser?.email) return;
    try {
      const data = await api.getMyTickets(loggedInUser.email);
      setMyTickets(data || []);
    } catch (e) {
      console.error("Error loading tickets:", e);
    }
  };

  useEffect(() => {
    loadMyTickets();
  }, [loggedInUser?.email]);

  const deleteTicket = async (id) => {
    if (!window.confirm("Delete this resolved ticket?")) return;
    try {
      await api.deleteTicket(id);
      showNotification("Ticket deleted successfully", "success");
      await loadMyTickets();
    } catch (err) {
      showNotification(err.message || "Failed to delete ticket", "error");
    }
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
