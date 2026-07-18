import { useReducer, useEffect } from "react";
import { AttendanceContext } from "./AttendanceContext";
import { attendanceReducer } from "../reducer/attendanceReducer";
import { api } from "../services/api";

const initialState = {
  records: []
};

const AttendanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(attendanceReducer, initialState);

  const fetchRecords = async () => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
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
  }, []);

  return (
    <AttendanceContext.Provider value={{ state, dispatch, fetchRecords }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceProvider;
