import React from 'react'
import { Link } from "react-router-dom"
import img1 from "../assets/images/productive_employees.jpg"
import "../assets/css/getstarted.css"

const GetStarted = () => {
  return (
    <div>
      <div className='get-started'>

        <div className='get-started-message'>
          <h1>Stay Productive with our Attendance Management System</h1>

          <Link to="/login">
            <button className='gsbtn'>Get Started</button>
          </Link>

          <ul>
            <li>Employee Check-In and Check-Out</li>
            <li>Shift-Based Attendance Management</li>
            <li>Automatic Attendance Status</li>
            <li>Working Hours Calculation</li>
            <li>Centralized Attendance Records</li>
            <li>Attendance Report Generation</li>
            <li>Scalable and modular system design</li>
          </ul>
        </div>
        <div className='getstartedimgdiv'>
          <img
            className='get-started-image'
            src={img1}
            alt="Productive employees"
          />
        </div>

      </div>
    </div>
  )
}

export default GetStarted
