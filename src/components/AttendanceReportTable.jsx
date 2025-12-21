import { useContext } from "react";
import { AttendanceContext } from "../context/AttendanceContext";
import "../assets/css/AttendanceReportTable.css";

const AttendanceReportTable = () => {
  const { state } = useContext(AttendanceContext);

  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (state.records.length === 0) {
    return <p className="no-data">No attendance records available</p>;
  }

  // Filter records based on user role
  let filteredRecords = state.records;
  if (storedUser && storedUser.role !== "admin") {
    filteredRecords = state.records.filter(record => record.name === storedUser.username);
  }

  // ✅ SORT: latest updated first
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    // Active session first
    if (!a.checkOut && b.checkOut) return -1;
    if (a.checkOut && !b.checkOut) return 1;

    // Latest date first
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="attendance-report">
      <h2>Attendance Report</h2>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Shift</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Working Hours</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {sortedRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.name}</td>
              <td>{record.shift}</td>
              <td>{record.checkIn}</td>
              <td>{record.checkOut || "—"}</td>
              <td>{record.workingHours || "—"}</td>
              <td>
                <span
                  className={`status-badge ${
                    record.status?.includes("Full")
                      ? "status-full"
                      : record.status?.includes("Half")
                      ? "status-half"
                      : "status-absent"
                  }`}
                >
                  {record.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceReportTable;
