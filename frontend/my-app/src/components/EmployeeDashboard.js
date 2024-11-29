import React, { useState } from "react";
import { viewShift, viewSchedule } from "../api"; 
import './EmployeeDashboardView.css';


const EmployeeDashboard = () => {
  const [shifts, setShifts] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState("");

  const handleViewShifts = async () => {
    try {
      const employeeId = localStorage.getItem("employee-id");
      const password = localStorage.getItem("password");
  
      if (!employeeId || !password) {
        throw new Error("Missing credentials. Please log in again.");
      }
  
      const data = await viewShift(employeeId, password);
      console.log("Shifts fetched:", data.shifts);
  
      setShifts(data.shifts);
      setError("");
    } catch (err) {
      console.error("Error fetching shifts:", err);
      setError(err.response?.data?.error || "Error fetching shifts");
      setShifts([]);
    }
  };
  
  
  const handleViewSchedule = async () => {
    try {
      const employeeId = localStorage.getItem("employee-id");
      const password = localStorage.getItem("password");
  
      if (!employeeId || !password) {
        throw new Error("Missing credentials. Please log in again.");
      }
  
      const data = await viewSchedule(employeeId, password);
      console.log("Schedule response:", data);
      setSchedule(data);
  
      // Ensure data.schedule exists and is an array
      if (!data?.schedule || !Array.isArray(data.schedule)) {
        throw new Error("Invalid schedule data");
      }
  
      // Group by date
      const groupedSchedule = data.schedule.reduce((acc, shift) => {
        const shiftDate = new Date(shift.shift_date).toLocaleDateString("en-US");
        if (!acc[shiftDate]) acc[shiftDate] = [];
        acc[shiftDate].push({
          start_time: shift.start_time,
          end_time: shift.end_time,
        });
        return acc;
      }, {});
  
      // Convert groupedSchedule into an array for rendering
      const formattedSchedule = Object.entries(groupedSchedule).map(
        ([date, shifts]) => ({
          date,
          shifts,
        })
      );
  
      setSchedule(formattedSchedule);
      setError("");
    } catch (err) {
      console.error("Error fetching schedule:", err);
      setError(err.response?.data?.error || "Error fetching schedule");
      setSchedule([]);
    }
  };
  
  
  return (
    <div className="employee-dashboard-container">
      <div className="dashboard-left">
        <h1>Employee Dashboard</h1>
        <div className="button-container">
          <button onClick={handleViewShifts}>View Shifts</button>
          <button onClick={handleViewSchedule}>View Schedule</button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
  
      <div className="dashboard-right">
        {shifts?.length > 0 && (
          <table border="1" className="shift-table">
            <thead>
              <tr>
                <th>Shift Date</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift, index) => (
                <tr key={index}>
                  <td>
                    {shift.formatted_date && shift.day_of_week
                      ? `${shift.formatted_date} (${shift.day_of_week})`
                      : "Date not available"}
                  </td>
                  <td>{shift.start_time || "Start time not available"}</td>
                  <td>{shift.end_time || "End time not available"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
  
        {schedule?.length > 0 && (
          <table border="1" className="schedule-table">
            <thead>
              <tr>
                <th>Shift Date</th>
                <th>Shifts</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((dayEntry, index) => (
                <tr key={index}>
                  <td>{dayEntry.date}</td>
                  <td>
                    {dayEntry.shifts.map((shift, i) => (
                      <div key={i}>
                        {shift.start_time} - {shift.end_time}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
  
  
};

export default EmployeeDashboard;
