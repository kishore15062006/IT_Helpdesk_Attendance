import React from "react";

const FeatureBox = ({ icon, title, bgColor,iconColor }) => {
  return (
    <div style={{ ...styles.box, backgroundColor: bgColor }}>
       <div style={{ ...styles.icon, color: iconColor }}>
        {icon}
        </div>
      <h3 style={styles.title}>{title}</h3>
    </div>
  );
};

const styles = {
  box: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    padding: "20px",
    width: "400px",
    height: "200px",
    margin: "10px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  icon: {
    fontSize: "60px",
    marginBottom: "25px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
  },
};

export default FeatureBox;
