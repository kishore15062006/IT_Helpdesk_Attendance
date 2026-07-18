import { useState, useEffect } from "react";
import "../assets/css/ShiftsGiven.css";
import { api } from "../services/api";

const ShiftsGiven = () => {
  const [myShifts, setMyShifts] = useState([]);

  useEffect(() => {
    const updateShifts = async () => {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!user) return;

      try {
        const shifts = await api.getShifts();
        const assignedShifts = (shifts || []).filter((shift) =>
          shift.employees.includes(user.id)
        );
        setMyShifts(assignedShifts);
      } catch (e) {
        console.error("Error loading assigned shifts:", e);
      }
    };

    updateShifts();

    window.addEventListener("focus", updateShifts);
    return () => {
      window.removeEventListener("focus", updateShifts);
    };
  }, []);

  return (
    <div className="my-shifts-container">
      <h2>My Assigned Shifts</h2>

      {myShifts.length === 0 ? (
        <p>No shifts assigned yet.</p>
      ) : (
        myShifts.map((shift) => (
          <div key={shift.id} className="shift-card">
            <h3>
              {shift.name}
              <span className="shift-type">{shift.type}</span>
            </h3>

            <p>
              <span>Time:</span> {shift.start} - {shift.end}
            </p>
            <p>
              <span>Break:</span> {shift.break}
            </p>
            <p>
              <span>Grace Period:</span> {shift.gracePeriod} min
            </p>
            <p>
              <span>Department:</span> {shift.department}
            </p>
            <p>
              <span>Location:</span> {shift.location}
            </p>
            <p>
              <span>Weekend Policy:</span> {shift.weekendPolicy}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default ShiftsGiven;
