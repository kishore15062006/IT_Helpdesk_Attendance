import { useState, useEffect } from "react";
import "../assets/css/ShiftsGiven.css";

const ShiftsGiven = () => {
  const [myShifts, setMyShifts] = useState([]);

  useEffect(() => {
    const updateShifts = () => {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!user) return;

      const shifts = JSON.parse(localStorage.getItem("shifts")) || [];
      const assignedShifts = shifts.filter((shift) =>
        shift.employees.includes(user.id)
      );

      setMyShifts(assignedShifts);
    };

    updateShifts();

    window.addEventListener("focus", updateShifts);
    window.addEventListener("storage", updateShifts);

    return () => {
      window.removeEventListener("focus", updateShifts);
      window.removeEventListener("storage", updateShifts);
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
