import React from "react";
import FeatureBox from "./FeatureBox";
import { FaUsers, FaChartBar, FaHandshake, FaCalendarCheck, FaClipboardList, FaBook, FaClock } from "react-icons/fa";

const features = [
  { icon: <FaUsers />, title: "Employee Database Management", bgColor: "#cce0feff",iconColor:"#4a90e2"},
  { icon: <FaHandshake />, title: "Employee Onboarding", bgColor: "#fbd7d7ff", iconColor: "#f5a623" },
  { icon: <FaCalendarCheck />, title: "Leave Tracker", bgColor: "#dae6faff",iconColor: "#4a90e2"},
  { icon: <FaClipboardList />, title: "Timesheets", bgColor: "#f9e6ceff",iconColor: "#f5a623"},
  { icon: <FaBook />, title: "Learning Management", bgColor: "#ccf5dfff",iconColor: "#e74c3c"},
  { icon: <FaClock />, title: "Shift Scheduling", bgColor: "#d0e4f9ff", iconColor: "#6c7a89" }
];

const FeatureBoxContainer = () => {
  return (
    <div style={styles.container}>
      {features.map((feature, index) => (
        <FeatureBox 
          key={index} 
          icon={feature.icon} 
          title={feature.title} 
          bgColor={feature.bgColor} 
          iconColor={feature.iconColor}
        />
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
    margin: "50px 0",
  },
};

export default FeatureBoxContainer;
