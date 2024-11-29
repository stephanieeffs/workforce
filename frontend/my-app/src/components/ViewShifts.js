import React, { useState } from 'react';
import axios from 'axios';

function ViewShifts() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [shifts, setShifts] = useState([]);
  const [error, setError] = useState('');

  const handleViewShifts = async () => {
    try {
      const employeeId = localStorage.getItem("employee_id");
      const password = localStorage.getItem("password");
  
      if (!employeeId || !password) {
        throw new Error("Missing credentials. Please log in again.");
      }
  
      const response = await axios.get(
        `http://localhost:3000/api/view-shift?employee_id=${employeeId}&password=${password}`
      );
  
      setShifts(response.data); // Assuming response contains the shifts array
      setError("");
    } catch (err) {
      console.error("Error fetching shifts:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Error fetching shifts");
      setShifts([]);
    }
  };
  
  
  return (
    <div>
      <h2>View Shifts</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleViewShifts}>View Shifts</button>
      <div>
        {shifts.map((shift, index) => (
          <div key={index}>
            <p>
              Date: {shift.formatted_date}, Day: {shift.day_of_week}, Start: {shift.start_time}, End: {shift.end_time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewShifts;
