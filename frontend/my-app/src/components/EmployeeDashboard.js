import React, { useState } from "react";
import { viewShift, viewSchedule } from "../api"; // Import API functions

const EmployeeDashboard = () => {
  const [shifts, setShifts] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState("");

  const handleViewShifts = async () => {
    try {
      const employeeId = localStorage.getItem("employee_id");
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
        const employeeId = localStorage.getItem("employee_id");
        const password = localStorage.getItem("password");

        if (!employeeId || !password) {
            throw new Error("Missing credentials. Please log in again.");
        }

        const data = await viewSchedule(employeeId, password);
        setSchedule(data.schedule);
        setError("");
    } catch (err) {
        console.error("Error fetching schedule:", err);
        setError(err.response?.data?.error || "Error fetching schedule");
        setSchedule([]);
    }
};

  
  

  return (
    <div>
      <h1>Employee Dashboard</h1>
      <button onClick={handleViewShifts}>View Shifts</button>
      <button onClick={handleViewSchedule}>View Schedule</button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {shifts.length > 0 && (
        <table border="1" style={{ margin: "20px auto", width: "80%" }}>
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

      {schedule.length > 0 && (
        <table border="1" style={{ margin: "20px auto", width: "80%" }}>
          <thead>
            <tr>
              <th>Day</th>
              <th>Shifts</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((day, index) => (
              <tr key={index}>
                <td>{day.day}</td>
                <td>
                  {day.shifts.map((shift, i) => (
                    <div key={i}>
                      {shift.date}: {shift.start_time} - {shift.end_time}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeDashboard;
