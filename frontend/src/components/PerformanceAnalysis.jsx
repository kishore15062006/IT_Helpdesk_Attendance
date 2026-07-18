import { useContext } from "react";
import { AttendanceContext } from "../context/AttendanceContext";
import "../assets/css/PerformanceAnalysis.css"

const PerformanceAnalysis = () => {
  const { state } = useContext(AttendanceContext);

  const totalEmployees = state.records.reduce((acc, rec) => {
    if (!acc.includes(rec.name)) acc.push(rec.name);
    return acc;
  }, []).length;

  const lateArrivals = state.records.filter(r => r.status && r.status.includes("Late")).length;

  const employeeData = state.records.reduce((acc, rec) => {
    if (!rec.checkIn || !rec.checkOut) return acc;

    if (!acc[rec.name]) acc[rec.name] = { name: rec.name, dateSessions: {} };

    if (!acc[rec.name].dateSessions[rec.date]) {
      acc[rec.name].dateSessions[rec.date] = { checkIns: [], checkOuts: [] };
    }

    acc[rec.name].dateSessions[rec.date].checkIns.push(rec.checkIn);
    acc[rec.name].dateSessions[rec.date].checkOuts.push(rec.checkOut);

    return acc;
  }, {});

  const employeeHoursMap = Object.values(employeeData).map(emp => {
    let totalHours = 0;
    let days = 0;

    for (const date in emp.dateSessions) {
      const sessions = emp.dateSessions[date];
      const checkInTimes = sessions.checkIns.map(t => new Date(`1970-01-01T${t}:00`).getTime());
      const checkOutTimes = sessions.checkOuts.map(t => new Date(`1970-01-01T${t}:00`).getTime());

      const minCheckIn = Math.min(...checkInTimes);
      const maxCheckOut = Math.max(...checkOutTimes);

      const hours = (maxCheckOut - minCheckIn) / 1000 / 3600;
      totalHours += hours;
      days += 1;
    }

    return {
      name: emp.name,
      hours: totalHours,
      days: days
    };
  });

  const bestEmployee = Object.values(employeeHoursMap).sort((a, b) => b.hours - a.hours)[0];

  const avgHours = Object.values(employeeHoursMap).reduce((sum, e) => sum + e.hours, 0) / (totalEmployees || 1);

  return (
    <div className="performance-container">
      <h3>Performance Overview</h3>
      <p>Total Employees: {totalEmployees}</p>
      <p>Late Arrivals: {lateArrivals}</p>
      <p>Average Working Hours per Employee: {avgHours.toFixed(2)} hrs</p>

      {bestEmployee ? (
        <div>
          <h4>Top Productive Employee</h4>
          <p>Name: {bestEmployee.name}</p>
          <p>Total Hours Worked: {bestEmployee.hours.toFixed(2)} hrs</p>
          <p>Days Worked: {bestEmployee.days}</p>
          <p>Average Daily Hours: {(bestEmployee.hours / bestEmployee.days).toFixed(2)} hrs</p>
        </div>
      ) : (
        <p>No work records found.</p>
      )}

      <div>
        <h4>All Employees Summary</h4>
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Days Worked</th>
              <th>Total Hours</th>
              <th>Average Daily Hours</th>
              <th>Late Arrivals</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(employeeHoursMap).map(emp => {
              const lateCount = state.records.filter(r => r.name === emp.name && r.status && r.status.includes("Late")).length;
              return (
                <tr key={emp.name}>
                  <td>{emp.name}</td>
                  <td>{emp.days}</td>
                  <td>{emp.hours.toFixed(2)}</td>
                  <td>{(emp.hours / emp.days).toFixed(2)}</td>
                  <td>{lateCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceAnalysis;
