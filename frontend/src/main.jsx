import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AttendanceProvider from './context/AttendanceProvider.jsx'

import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AttendanceProvider>
        <App />
      </AttendanceProvider>
    </ThemeProvider>
  </StrictMode>
)
