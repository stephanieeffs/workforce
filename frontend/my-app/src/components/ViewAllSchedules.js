import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewAllSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/schedule');
        setSchedules(response.data.schedule);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Failed to fetch schedules');
      }
    };

    fetchSchedules();
  }, []);

  return (
    <div>
      <h2>View All Schedules</h2>
      {message && <p>{message}</p>}
      <ul>
        {schedules.map((day, index) => (
          <li key={index}>
            <strong>{day.day}</strong>
            <ul>
              {day.shifts.map((shift, idx) => (
                <li key={idx}>
                  Employee: {shift.employee_name} | Date: {shift.date} | Start: {shift.start_time} | End: {shift.end_time}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewAllSchedules;
