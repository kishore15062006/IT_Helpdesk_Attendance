export const attendanceReducer = (state, action) => {
  switch (action.type) {
    case "SET_RECORDS":
      return {
        ...state,
        records: action.payload,
      };

    case "CHECK_IN": {
      const shiftStart = {
        Morning: "09:00",
        Evening: "14:00",
        Night: "22:00",
      };

      const checkInTime = new Date(`1970-01-01T${action.payload.time}:00`);
      const shiftStartTime = new Date(
        `1970-01-01T${shiftStart[action.payload.shift]}:00`
      );

      const status = checkInTime > shiftStartTime ? "Late" : "Present";

      return {
        ...state,
        records: [
          ...state.records,
          {
            id: Date.now(),
            name: action.payload.name,
            shift: action.payload.shift,
            checkIn: action.payload.time,
            checkOut: null,
            workingHours: null,
            status,
            date: action.payload.date, // ✅ ADD THIS
          },
        ],
      };
    }

    case "CHECK_OUT":
      return {
        ...state,
        records: state.records.map((record) => {
          if (record.id === action.payload.id) {
            let checkInTime = new Date(`1970-01-01T${record.checkIn}:00`);
            let checkOutTime = new Date(
              `1970-01-01T${action.payload.time}:00`
            );

            // Handle overnight shifts
            if (checkOutTime < checkInTime) {
              checkOutTime.setDate(checkOutTime.getDate() + 1);
            }

            const diff = checkOutTime - checkInTime;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff / (1000 * 60)) % 60);

            let finalStatus = record.status;

            if (hours >= 8) {
              finalStatus = "Full Day";
            } else if (hours >= 4) {
              finalStatus = "Half Day";
            } else {
              finalStatus = "Absent";
            }

            if (record.status === "Late" && finalStatus !== "Absent") {
              finalStatus = `Late (${finalStatus})`;
            }

            return {
              ...record,
              checkOut: action.payload.time,
              workingHours: `${hours}h ${minutes}m`,
              status: finalStatus,
            };
          }
          return record;
        }),
      };

    default:
      return state;
  }
};
