import React from "react";

const FeatureBox = ({ icon, title }) => {
  return (
    <div className="feature-box">
      <div className="feature-icon">
        {icon}
      </div>
      <h3 className="feature-title">{title}</h3>
    </div>
  );
};

export default FeatureBox;
