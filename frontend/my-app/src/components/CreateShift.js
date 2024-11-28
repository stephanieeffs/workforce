import React, { useState } from 'react';
import axios from 'axios';

function CreateShift() {
  const [employeeId, setEmployeeId] = useState('');
  const [shiftDate, setShiftDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateShift = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/shifts', {
        employee_id: employeeId,
        shift_date: shiftDate,
        start_time: startTime,
        end_time: endTime,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to create shift');
    }
  };

  return (
    <div>
      <h2>Create Shift</h2>
      {message && <p>{message}</p>}
      <input
        type="text"
        placeholder="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      />
      <input
        type="date"
        placeholder="Shift Date"
        value={shiftDate}
        onChange={(e) => setShiftDate(e.target.value)}
      />
      <input
        type="time"
        placeholder="Start Time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <input
        type="time"
        placeholder="End Time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <button onClick={handleCreateShift}>Create Shift</button>
    </div>
  );
}

export default CreateShift;
