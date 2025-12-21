import { useReducer, useEffect } from "react";
import { AttendanceContext } from "./AttendanceContext";
import { attendanceReducer } from "../reducer/attendanceReducer";

const initialState = {
  records: JSON.parse(localStorage.getItem("attendanceRecords")) || []
};

const AttendanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(attendanceReducer, initialState);

  useEffect(() => {
    localStorage.setItem(
      "attendanceRecords",
      JSON.stringify(state.records)
    );
  }, [state.records]);

  return (
    <AttendanceContext.Provider value={{ state, dispatch }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceProvider;
