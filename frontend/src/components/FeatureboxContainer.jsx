import React from "react";
import FeatureBox from "./FeatureBox";
import { FaUsers, FaHandshake, FaCalendarCheck, FaClipboardList, FaBook, FaClock } from "react-icons/fa";

const features = [
  { icon: <FaUsers />, title: "Employee Database Management" },
  { icon: <FaHandshake />, title: "Employee Onboarding" },
  { icon: <FaCalendarCheck />, title: "Leave Tracker" },
  { icon: <FaClipboardList />, title: "Timesheets" },
  { icon: <FaBook />, title: "Learning Management" },
  { icon: <FaClock />, title: "Shift Scheduling" }
];

const FeatureBoxContainer = () => {
  return (
    <div className="feature-box-container">
      {features.map((feature, index) => (
        <FeatureBox 
          key={index} 
          icon={feature.icon} 
          title={feature.title} 
        />
      ))}
    </div>
  );
};

export default FeatureBoxContainer;
