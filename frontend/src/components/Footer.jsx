import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-left">
        <a href="/terms" className="footer-link">Terms of Service</a>
        <span className="footer-separator">|</span>
        <a href="/privacy" className="footer-link">Privacy Policy</a>
      </div>
      <div className="footer-right">
        <span className="footer-copy">&#169; {currentYear} Kishore P. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
