import React from 'react'
import GetStarted from '../components/GetStarted'
import Footer from '../components/Footer'
import FeatureBoxContainer from '../components/FeatureboxContainer'
import { useTheme } from '../context/ThemeContext'

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <button className="theme-floating-btn" onClick={toggleTheme} type="button" aria-label="Toggle Theme">
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
      <GetStarted/>
      <FeatureBoxContainer/>
      <Footer/>
    </div>
  )
}

export default LandingPage
