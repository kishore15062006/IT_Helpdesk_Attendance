import { useContext } from "react";
import { AttendanceContext } from "../context/AttendanceContext";
import "../assets/css/AttendanceReportTable.css";
import { useAuth } from "../context/AuthContext";

const AttendanceReportTable = () => {
  const { state } = useContext(AttendanceContext);
  const { user: storedUser } = useAuth();

  if (state.records.length === 0) {
    return <p className="no-data">No attendance records available</p>;
  }

  let filteredRecords = state.records;
  if (storedUser && storedUser.role !== "admin") {
    filteredRecords = state.records.filter(record => record.name === storedUser.username);
  }

  const sortedRecords = [...filteredRecords].sort((a, b) => {
   
    if (!a.checkOut && b.checkOut) return -1;
    if (a.checkOut && !b.checkOut) return 1;

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
