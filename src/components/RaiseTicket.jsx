import { useState } from "react";
import "../assets/css/TicketStyles.css";

const RaiseTicket = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const [issueType, setIssueType] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!issueType || !description) {
      alert("Please fill all required fields");
      return;
    }

    const tickets = JSON.parse(localStorage.getItem("tickets")) || [];

    const newTicket = {
      id: Date.now(),
      raisedBy: loggedInUser.email,
      username: loggedInUser.username,
      issueType,
      priority,
      description,
      status: "Open",
      adminComment: "",
      createdAt: new Date().toLocaleString(),
    };

    localStorage.setItem("tickets", JSON.stringify([...tickets, newTicket]));

    alert("Ticket raised successfully");

    setIssueType("");
    setPriority("Medium");
    setDescription("");
  };

  return (
    <div className="ticket-container">
      <h2>Raise Support Ticket</h2>

      <form className="ticket-form" onSubmit={handleSubmit}>
        <select
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
          required
        >
          <option value="">Select Issue</option>
          <option value="Attendance Issue">Attendance Issue</option>
          <option value="Leave Issue">Leave Issue</option>
          <option value="Shift Issue">Shift Issue</option>
          <option value="System / Login Issue">System / Login Issue</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <textarea
          placeholder="Describe your issue clearly..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button className="ticket-btn" type="submit">
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default RaiseTicket;
