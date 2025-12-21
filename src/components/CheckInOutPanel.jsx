import { useContext, useState } from "react";
import { AttendanceContext } from "../context/AttendanceContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../assets/css/CheckInOutPanel.css";

const CheckInOutPanel = () => {
  const { state, dispatch } = useContext(AttendanceContext);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const name = loggedInUser?.username || "Employee";

  const [shift, setShift] = useState("Morning");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSummary, setSelectedSummary] = useState(null);

  const handleCheckIn = () => {
    const alreadyCheckedIn = state.records.find(
      (r) => r.name === name && r.checkOut === null
    );

    if (alreadyCheckedIn) {
      alert("You are already checked in!");
      return;
    }

    const now = new Date();

    dispatch({
      type: "CHECK_IN",
      payload: {
        name,
        shift,
        time: now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        date: now.toISOString(),
      },
    });
  };

  const handleCheckOut = (id) => {
    const time = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    dispatch({
      type: "CHECK_OUT",
      payload: { id, time },
    });
  };

  const isSameDay = (d1, d2) =>
    new Date(d1).toDateString() === new Date(d2).toDateString();

  const getDaySummary = (date) => {
    const dayRecords = state.records
      .filter((r) => r.name === name && isSameDay(r.date, date))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (dayRecords.length === 0) {
      return { status: "Absent" };
    }

    const leaveRecord = dayRecords.find((r) => r.leave);
    if (leaveRecord) {
      return {
        status: "Leave",
        reason: leaveRecord.reason || "No reason provided",
      };
    }

    const firstCheckIn = dayRecords[0].checkIn;
    const lastCheckOut = dayRecords[dayRecords.length - 1].checkOut;

    if (!lastCheckOut) {
      return {
        status: "Present",
        firstCheckIn,
        lastCheckOut: "-",
        workingHours: "-",
      };
    }

    let inTime = new Date(`1970-01-01T${firstCheckIn}:00`);
    let outTime = new Date(`1970-01-01T${lastCheckOut}:00`);

    if (outTime < inTime) {
      outTime.setDate(outTime.getDate() + 1);
    }

    const diffMs = outTime - inTime;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

    return {
      status: "Present",
      firstCheckIn,
      lastCheckOut,
      workingHours: `${hours}h ${minutes}m`,
    };
  };

  const sortedRecords = state.records
    .filter((r) => r.name === name)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="checkin-layout">
      <div className="checkin-panel">
        <h3>Check In / Check Out</h3>

        <div className="checkin-card">
          <div className="employee-info">
            <span className="label">Employee</span>
            <span className="value">{name}</span>
          </div>

          <div className="shift-select">
            <label>Shift</label>
            <select value={shift} onChange={(e) => setShift(e.target.value)}>
              <option>Morning</option>
              <option>Evening</option>
              <option>Night</option>
            </select>
          </div>

          <button className="checkin-btn" onClick={handleCheckIn}>
            Check In
          </button>
        </div>

        <h4>Recent Check-ins</h4>

        {sortedRecords.length === 0 && (
          <p className="muted-text">No attendance records yet</p>
        )}

        {sortedRecords.map((record) => (
          <div key={record.id} className="active-record">
            <div>
              <strong>{record.shift}</strong>
              <span>In: {record.checkIn}</span>
              {record.checkOut && <span>Out: {record.checkOut}</span>}
            </div>

            {!record.checkOut && (
              <button
                className="checkout-btn"
                onClick={() => handleCheckOut(record.id)}
              >
                Check Out
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="calendar-panel">
        <h3>Attendance Calendar</h3>

        <Calendar
          value={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setSelectedSummary(getDaySummary(date));
          }}
          tileClassName={({ date }) => {
            const summary = getDaySummary(date);

            if (summary.status === "Leave") return "leave-day";
            if (summary.status === "Present") return "present-day";
            if (date < new Date()) return "absent-day";

            return null;
          }}
        />

        {selectedSummary && (
          <div className="calendar-details">
            <h4>{selectedDate.toDateString()}</h4>

            {selectedSummary.status === "Present" && (
              <>
                <p>
                  <strong>Status:</strong> Present
                </p>
                <p>
                  <strong>First Check-in:</strong>{" "}
                  {selectedSummary.firstCheckIn}
                </p>
                <p>
                  <strong>Last Check-out:</strong>{" "}
                  {selectedSummary.lastCheckOut}
                </p>
                <p>
                  <strong>Working Hours:</strong> {selectedSummary.workingHours}
                </p>
              </>
            )}

            {selectedSummary.status === "Absent" && (
              <p>
                <strong>Status:</strong> Absent
              </p>
            )}

            {selectedSummary.status === "Leave" && (
              <>
                <p>
                  <strong>Status:</strong> Leave
                </p>
                <p>
                  <strong>Reason:</strong> {selectedSummary.reason}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInOutPanel;
