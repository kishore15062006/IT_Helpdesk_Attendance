import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("appTheme") || "dark";
  });

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("appTheme", nextTheme);
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
  };

  useEffect(() => {
    // Apply dataset attribute to document root for global CSS variables swap
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        closeNotification();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, showNotification }}>
      {children}

      {/* Global Glassmorphic Toast Notification popup */}
      {notification.show && (
        <div className={`custom-popup-toast ${notification.type}`} onClick={closeNotification}>
          <div className="popup-icon">
            {notification.type === "success" ? "✓" : "✕"}
          </div>
          <div className="popup-message">{notification.message}</div>
          <button className="popup-close">✕</button>
        </div>
      )}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
