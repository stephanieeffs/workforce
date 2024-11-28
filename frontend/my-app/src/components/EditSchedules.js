import React, { useState } from 'react';
import axios from 'axios';

function EditSchedule() {
  const [shiftId, setShiftId] = useState('');
  const [shiftDate, setShiftDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [action, setAction] = useState('edit');
  const [message, setMessage] = useState('');

  const handleEditSchedule = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/api/shifts/${shiftId}`, {
        action,
        shift_date: shiftDate,
        start_time: startTime,
        end_time: endTime,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to edit schedule');
    }
  };

  return (
    <div>
      <h2>Edit Schedule</h2>
      <input
        type="text"
        placeholder="Shift ID"
        value={shiftId}
        onChange={(e) => setShiftId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Shift Date (YYYY-MM-DD)"
        value={shiftDate}
        onChange={(e) => setShiftDate(e.target.value)}
      />
      <input
        type="text"
        placeholder="Start Time (HH:MM:SS)"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <input
        type="text"
        placeholder="End Time (HH:MM:SS)"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <select value={action} onChange={(e) => setAction(e.target.value)}>
        <option value="edit">Edit</option>
        <option value="remove">Remove</option>
      </select>
      <button onClick={handleEditSchedule}>{action === 'edit' ? 'Edit' : 'Remove'} Shift</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default EditSchedule;
