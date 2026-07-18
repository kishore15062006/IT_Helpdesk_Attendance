import { useContext } from "react";
import { AttendanceContext } from "../context/AttendanceContext";
import "../assets/css/AdminAttendancePanel.css"
import { api } from "../services/api";
import { useTheme } from "../context/ThemeContext";

const AdminAttendancePanel = () => {
  const { state, fetchRecords } = useContext(AttendanceContext);
  const { showNotification } = useTheme();

  const handleClearRecords = async () => {
    if (window.confirm("Clear all attendance records?")) {
      try {
        await api.clearAttendance();
        showNotification("All attendance records cleared successfully!", "success");
        if (fetchRecords) await fetchRecords();
      } catch (err) {
        showNotification(err.message || "Failed to clear records", "error");
      }
    }
  };

  const handleExport = () => {
    let csvContent = "Name,Shift,CheckIn,CheckOut,WorkingHours,Status\n";

    state.records.forEach((r) => {
      csvContent += `${r.name},${r.shift},${r.checkIn},${r.checkOut || ""},${r.workingHours || ""},${r.status}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_report.csv";
    a.click();
  };

  return (
    <div className="admin-attendance-panel">
      <h2>Admin Attendance Panel</h2>

      <p>Total Attendance Records: {state.records.length}</p>

      <div className="admin-actions">
        <button className="export-btn" onClick={handleExport}>
          Export Attendance Report
        </button>

        <button className="clear-btn" onClick={handleClearRecords}>
          Clear Attendance (New Day)
        </button>
      </div>
    </div>
  );
};

export default AdminAttendancePanel;
