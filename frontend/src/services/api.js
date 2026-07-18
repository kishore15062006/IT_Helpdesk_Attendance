const API_BASE_URL = "http://localhost:8080/api";

const request = async (url, options = {}) => {
  const token = localStorage.getItem("jwtToken");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "API error occurred");
  }

  // Handle empty or 204 responses
  if (response.status === 204) return null;
  
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const api = {
  // Auth & User
  register: (user) => request("/users/register", { method: "POST", body: JSON.stringify(user) }),
  login: (username, password, role) => request("/users/login", { method: "POST", body: JSON.stringify({ username, password, role }) }),
  getEmployees: () => request("/users/employees"),
  getUserProfile: (id) => request(`/users/${id}`),
  updateProfile: (profile) => request("/users/update-profile", { method: "PUT", body: JSON.stringify(profile) }),

  // Attendance
  getAttendanceRecords: () => request("/attendance"),
  getUserAttendanceRecords: (username) => request(`/attendance/user/${username}`),
  checkIn: (record) => request("/attendance/check-in", { method: "POST", body: JSON.stringify(record) }),
  checkOut: (id, time) => request("/attendance/check-out", { method: "POST", body: JSON.stringify({ id, time }) }),
  clearAttendance: () => request("/attendance/clear", { method: "DELETE" }),

  // Leaves
  getLeaveRequests: () => request("/leaves"),
  getUserLeaveRequests: (email) => request(`/leaves/user/${email}`),
  applyLeave: (leave) => request("/leaves/apply", { method: "POST", body: JSON.stringify(leave) }),
  updateLeaveStatus: (id, status, comment) => request(`/leaves/update-status/${id}`, { method: "PUT", body: JSON.stringify({ status, comment }) }),

  // Tickets
  getTickets: () => request("/tickets/admin"), // For admin, get non-hidden tickets
  getMyTickets: (email) => request(`/tickets/raised-by/${email}`),
  raiseTicket: (ticket) => request("/tickets/raise", { method: "POST", body: JSON.stringify(ticket) }),
  updateTicket: (id, updates) => request(`/tickets/update/${id}`, { method: "PUT", body: JSON.stringify(updates) }),
  hideTicket: (id) => request(`/tickets/hide/${id}`, { method: "PUT" }),
  deleteTicket: (id) => request(`/tickets/${id}`, { method: "DELETE" }),

  // Shifts
  getShifts: () => request("/shifts"),
  createShift: (shift) => request("/shifts/create", { method: "POST", body: JSON.stringify(shift) }),
  deleteShift: (id) => request(`/shifts/${id}`, { method: "DELETE" }),
  removeEmployeeFromShift: (shiftId, empId) => request(`/shifts/${shiftId}/remove-employee/${empId}`, { method: "PUT" }),
  reassignShiftEmployee: (shiftId, oldEmpId, newEmpId) => request(`/shifts/${shiftId}/reassign?oldEmpId=${oldEmpId}&newEmpId=${newEmpId}`, { method: "PUT" }),
};
