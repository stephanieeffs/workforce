import React, { useState } from 'react';
import axios from 'axios';

function ViewSchedule() {
  const [employeeId, setEmployeeId] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [message, setMessage] = useState('');

  const handleViewSchedule = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/employee/view-schedule', { employee_id: employeeId });
      setSchedule(response.data.schedule);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to view schedule');
    }
  };

  return (
    <div>
      <h2>View Schedule</h2>
      <input
        type="text"
        placeholder="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      />
      <button onClick={handleViewSchedule}>View Schedule</button>
      {message && <p>{message}</p>}
      <ul>
        {schedule.map((day, index) => (
          <li key={index}>
            <strong>{day.day}</strong>
            <ul>
              {day.shifts.map((shift, idx) => (
                <li key={idx}>
                  Date: {shift.date} | Start: {shift.start_time} | End: {shift.end_time}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewSchedule;
