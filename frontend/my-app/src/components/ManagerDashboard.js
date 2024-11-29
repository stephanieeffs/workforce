import React, { useState } from "react";
import { viewManagerShift, viewManagerSchedule } from "../api";


const ManagerDashboard = () => {
  const [shifts, setShifts] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState("");


  const handleViewShifts = async () => {
    try {
      const manager_id = localStorage.getItem("manager-id");
      const password = localStorage.getItem("password");


      console.log(`ManagerID from localStorage: ${manager_id}`);
      console.log(`Password from localStorage: ${password}`);


      if (!manager_id || !password) {
        throw new Error("Missing credentials. Please log in again.");
      }


      const data = await viewManagerShift(manager_id, password);
      console.log("Shifts fetched:", data.shifts);
      setShifts(data.shifts);
      setError("");
    } catch (err) {
      console.error("Error fetching manager shifts:", err);
      setError(err.error || "Error fetching manager shifts");
    }
  };


  const handleViewSchedule = async () => {
    try {
      const managerId = localStorage.getItem("manager-id");
      const password = localStorage.getItem("password");


      if (!managerId || !password) {
        throw new Error("Missing credentials. Please log in again.");
      }


      const data = await viewManagerSchedule(managerId, password);


      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid schedule data");
      }


      console.log("Schedule fetched:", data);
      setSchedule(data);
      setError("");
    } catch (err) {
      console.error("Error fetching manager schedule:", err);
      setError(err.response?.data?.error || "Error fetching manager schedule");
      setSchedule([]);
    }
  };


  return (
    <div>
      <h1>Manager Dashboard</h1>
      <button onClick={handleViewShifts}>View Shifts</button>
      <button onClick={handleViewSchedule}>View Schedule</button>
      {error && <p style={{ color: "red" }}>{error}</p>}


      {shifts?.length > 0 && (
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
                <td>{new Date(shift.shift_date).toLocaleDateString()}</td>
                <td>{shift.start_time}</td>
                <td>{shift.end_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}


      {schedule?.length > 0 && (
        <table border="1" style={{ margin: "20px auto", width: "80%" }}>
          <thead>
            <tr>
              <th>Schedule Date</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.shift_date).toLocaleDateString()}</td>
                <td>{item.start_time}</td>
                <td>{item.end_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};


export default ManagerDashboard;



