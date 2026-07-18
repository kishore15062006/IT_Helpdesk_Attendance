import { useReducer, useEffect } from "react";
import { AttendanceContext } from "./AttendanceContext";
import { attendanceReducer } from "../reducer/attendanceReducer";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

const initialState = {
  records: []
};

const AttendanceProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(attendanceReducer, initialState);

  const fetchRecords = async () => {
    if (!user) return;
    try {
      let data;
      if (user.role === "admin") {
        data = await api.getAttendanceRecords();
      } else {
        data = await api.getUserAttendanceRecords(user.username);
      }
      dispatch({ type: "SET_RECORDS", payload: data || [] });
    } catch (e) {
      console.error("Error fetching attendance records", e);
    }
  };

  useEffect(() => {
    fetchRecords();
    window.addEventListener("focus", fetchRecords);
    return () => {
      window.removeEventListener("focus", fetchRecords);
    };
  }, [user]);

  return (
    <AttendanceContext.Provider value={{ state, dispatch, fetchRecords }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceProvider;
