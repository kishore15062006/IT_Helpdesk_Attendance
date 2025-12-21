import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.left}>
        <a href="/terms" style={styles.link}>Terms of Service</a>
        <span style={styles.separator}>|</span>
        <a href="/privacy" style={styles.link}>Privacy Policy</a>
      </div>
      <div style={styles.right}>
        <span>&#169; {currentYear}Kishore P. All rights reserved.</span>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    borderTop: "1px solid #ccc",
    backgroundColor: "#ccc",
    fontSize: "14px"
  },
  left: {
    display: "flex",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    color: "#333",
    margin: "0 5px"
  },
  separator: {
    margin: "0 5px",
    color: "#333"
  },
  right: {
    color: "#333"
  }
};

export default Footer;
