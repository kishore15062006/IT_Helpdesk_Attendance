import { BrowserRouter, Routes, Route } from "react-router-dom";
import LeaveApproval from "./components/LeaveApproval";
import ProtectedRoute from "./routes/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginForm from "./pages/Login";
import Registration from "./pages/Registration";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import LeaveRequest from "./components/LeaveRequest";
import AttendanceReportTable from "./components/AttendanceReportTable";
import AdminAttendancePanel from "./components/AdminAttendancePanel"
import ShiftScheduleView from "./components/ShiftScheduleView";
import PerformanceAnalysis from "./components/PerformanceAnalysis";
import CheckInOutPanel from "./components/CheckInOutPanel";
import ShiftsGiven from "./components/ShiftsGiven";
import AttendanceProvider from "./context/AttendanceProvider";
import RaiseTicket from "./components/RaiseTicket";
import MyTickets from "./components/MyTickets";
import AdminTickets from "./components/AdminTickets";

const App = () => {
  return (
    <AttendanceProvider>
    <BrowserRouter basename="/IT_Helpdesk_Attendance">
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Registration />} />

        
        <Route
          path="/employeeDashboard"
          element={
            <ProtectedRoute allowedRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<CheckInOutPanel />} />
          <Route path="raiseTicket" element={<RaiseTicket />} />
          <Route path="myTickets" element={<MyTickets />} />
          <Route path="checkInOut" element={<CheckInOutPanel />} />
          <Route path="leaveRequest" element={<LeaveRequest />} />
          <Route path="attendanceReport" element={<AttendanceReportTable />} />
          <Route path="shiftsGiven" element={<ShiftsGiven />} />
        </Route>

        <Route
          path="/adminDashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<PerformanceAnalysis/>} />
          <Route path="performanceAnalytics" element={<PerformanceAnalysis/>}/>
          <Route path="shiftSchedule" element={<ShiftScheduleView />} />
          <Route path="attendanceReport" element={<AttendanceReportTable />} />
          <Route path="leaveApproval" element={<LeaveApproval/>} />
          <Route path="adminAttendancePanel" element={<AdminAttendancePanel />} />
          <Route path="supportTickets" element={<AdminTickets />} />

        </Route>
      </Routes>
    </BrowserRouter>
    </AttendanceProvider>
  );
};

export default App;
