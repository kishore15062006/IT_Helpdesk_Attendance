import { useContext } from "react";
import { AttendanceContext } from "../context/AttendanceContext";

const HelpdeskAttendanceDashboard = () => {
  const { state } = useContext(AttendanceContext);

  const activeStaff = state.records.filter(
    (r) => r.checkOut === null
  );

  const lateStaff = state.records.filter(
    (r) => r.status === "Late"
  ).length;

  return (
    <div>
      <h2>Helpdesk Attendance Dashboard</h2>
      <p>Available Staff: {activeStaff.length}</p>
      <p>Late Arrivals Today: {lateStaff}</p>
    </div>
  );
};

export default HelpdeskAttendanceDashboard;
