import { useState, useEffect } from "react";
import "../assets/css/ShiftSchedule.css"

const ShiftScheduleView = () => {
  const [shifts, setShifts] = useState(
    () => JSON.parse(localStorage.getItem("shifts")) || []
  );

  const [shiftForm, setShiftForm] = useState({
    name: "",
    type: "day",
    start: "",
    end: "",
    break: "",
    gracePeriod: 0,
    department: "",
    location: "",
    weekendPolicy: "none",
    employees: [],
  });

  const [allEmployees, setAllEmployees] = useState(() =>
    (JSON.parse(localStorage.getItem("users")) || []).filter(
      (u) => u?.role === "employee"
    )
  );

  useEffect(() => {
    const updateEmployees = () => {
      setAllEmployees(
        (JSON.parse(localStorage.getItem("users")) || []).filter(
          (u) => u?.role === "employee"
        )
      );
    };

    window.addEventListener("focus", updateEmployees);
    window.addEventListener("storage", updateEmployees);

    return () => {
      window.removeEventListener("focus", updateEmployees);
      window.removeEventListener("storage", updateEmployees);
    };
  }, []);

  useEffect(
    () => localStorage.setItem("shifts", JSON.stringify(shifts)),
    [shifts]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "employees") {
      const empId = parseInt(value);
      setShiftForm({
        ...shiftForm,
        employees: checked
          ? [...shiftForm.employees, empId]
          : shiftForm.employees.filter((id) => id !== empId),
      });
    } else {
      setShiftForm({
        ...shiftForm,
        [name]: type === "number" ? parseInt(value) || 0 : value,
      });
    }
  };

  const checkConflicts = (newShift) => {
    return shifts
      .filter((s) =>
        s.employees.some(
          (emp) =>
            newShift.employees.includes(emp) &&
            newShift.start < s.end &&
            newShift.end > s.start
        )
      )
      .map((s) => `Conflict for employee(s) in shift "${s.name}"`);
  };

  const addShift = (e) => {
    e.preventDefault();
    if (!shiftForm.name || !shiftForm.start || !shiftForm.end)
      return alert("Fill required fields");
    if (shiftForm.start >= shiftForm.end)
      return alert("Start time must be before end time");

    const conflicts = checkConflicts(shiftForm);
    if (
      conflicts.length > 0 &&
      !window.confirm(`Conflicts detected: ${conflicts.join(", ")}. Proceed?`)
    )
      return;

    setShifts([...shifts, { id: Date.now(), ...shiftForm }]);
    setShiftForm({
      name: "",
      type: "day",
      start: "",
      end: "",
      break: "",
      gracePeriod: 0,
      department: "",
      location: "",
      weekendPolicy: "none",
      employees: [],
    });
    alert("Shift added successfully");
  };

  const removeEmployee = (shiftId, empId) => {
    setShifts(
      shifts.map((s) =>
        s.id === shiftId
          ? { ...s, employees: s.employees.filter((id) => id !== empId) }
          : s
      )
    );
  };

  const deleteShift = (shiftId) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
      setShifts(shifts.filter((s) => s.id !== shiftId));
    }
  };

  const suggestReplacements = (shiftId, empId) => {
    const shift = shifts.find((s) => s.id === shiftId);
    if (!shift) return [];
    const busy = shifts
      .filter(
        (s) => s.id !== shiftId && s.start < shift.end && s.end > shift.start
      )
      .flatMap((s) => s.employees);
    return allEmployees.filter((e) => !busy.includes(e.id) && e.id !== empId);
  };

  const reassignEmployee = (shiftId, oldEmpId, newEmpId) => {
    const shift = shifts.find((s) => s.id === shiftId);
    if (!shift) return;
    const busy = shifts
      .filter(
        (s) => s.id !== shiftId && s.start < shift.end && s.end > shift.start
      )
      .flatMap((s) => s.employees);
    if (busy.includes(newEmpId))
      return alert("Employee not available due to conflict");
    setShifts(
      shifts.map((s) =>
        s.id === shiftId
          ? {
              ...s,
              employees: s.employees.map((id) =>
                id === oldEmpId ? newEmpId : id
              ),
            }
          : s
      )
    );
  };

  return (
    <div className="shift-schedule-container">
      <h2>Shift Schedule & Management</h2>

      <form
        onSubmit={addShift}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        <h3>Create New Shift</h3>
        <input
          type="text"
          name="name"
          placeholder="Shift Name"
          value={shiftForm.name}
          onChange={handleChange}
          required
        />
        <select name="type" value={shiftForm.type} onChange={handleChange}>
          <option value="day">Day</option>
          <option value="night">Night</option>
          <option value="rotating">Rotating</option>
          <option value="flexible">Flexible</option>
          <option value="split">Split</option>
        </select><br/>
        <input
          type="time"
          name="start"
          value={shiftForm.start}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="end"
          value={shiftForm.end}
          onChange={handleChange}
          required
        /><br/>
        <input
          type="text"
          name="break"
          placeholder="Break Duration"
          value={shiftForm.break}
          onChange={handleChange}
        />
        <label>Grace period:</label>
        <input
          type="number"
          name="gracePeriod"
          placeholder= "Grace Period (min)"
          value={shiftForm.gracePeriod}
          onChange={handleChange}
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={shiftForm.department}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={shiftForm.location}
          onChange={handleChange}
        /><br/>
        <label>Weekendpolicy:</label>
        <select
          name="weekendPolicy"
          value={shiftForm.weekendPolicy}
          placeholder="weekendpolicy"
          onChange={handleChange}
        >
          <option value="none">none</option>
          <option value="double-time">Double Time</option>
          <option value="overtime">Overtime</option>
        </select>

        <div>
          <h4>Assign Employees</h4>
          {allEmployees.map((emp) => (
            <label key={emp.id} style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                name="employees"
                value={emp.id}
                checked={shiftForm.employees.includes(emp.id)}
                onChange={handleChange}
              />{" "}
              {emp.username}
            </label>
          ))}
        </div>
        <button type="submit">Add Shift</button>
      </form>

      {shifts.length === 0 && <p>No shifts defined yet.</p>}

      {shifts.map((shift) => {
        const assignedEmployees = allEmployees.filter((e) =>
          shift.employees.includes(e.id)
        );
        return (
          <div
            key={shift.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>
              {shift.name} ({shift.type}){" "}
              <button
                onClick={() => deleteShift(shift.id)}
                style={{ float: "right" }}
              >
                Delete Shift
              </button>
            </h3>
            <p>
              Time: {shift.start}-{shift.end} | Break: {shift.break} | Grace:{" "}
              {shift.gracePeriod} min | Dept: {shift.department} | Loc:{" "}
              {shift.location} | Weekend: {shift.weekendPolicy}
            </p>
            <h4>Assigned Employees:</h4>
            {assignedEmployees.length === 0 ? (
              <p style={{ color: "red" }}>⚠ No employees assigned</p>
            ) : (
              <ul>
                {assignedEmployees.map((emp) => (
                  <li key={emp.id}>
                    {emp.username}
                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() => removeEmployee(shift.id, emp.id)}
                    >
                      Remove
                    </button>
                    <select
                      style={{ marginLeft: "10px" }}
                      onChange={(e) => {
                        const newId = parseInt(e.target.value);
                        if (newId) reassignEmployee(shift.id, emp.id, newId);
                        e.target.value = "";
                      }}
                    >
                      <option value="">Reassign to...</option>
                      {suggestReplacements(shift.id, emp.id).map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.username}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ShiftScheduleView;
