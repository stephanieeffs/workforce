import React, { useState } from 'react';
import axios from 'axios';

function ViewShifts() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [shifts, setShifts] = useState([]);
  const [error, setError] = useState('');

  const handleViewShifts = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/shifts/view-shift', {
        employee_id: employeeId,
        password,
      });
      setShifts(response.data.shifts);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch shifts');
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
