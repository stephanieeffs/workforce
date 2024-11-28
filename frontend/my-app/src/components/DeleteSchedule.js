import React, { useState } from 'react';
import axios from 'axios';

function DeleteSchedule() {
  const [scheduleId, setScheduleId] = useState('');
  const [message, setMessage] = useState('');

  const handleDeleteSchedule = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/schedule/${scheduleId}`);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete schedule');
    }
  };

  return (
    <div>
      <h2>Delete Schedule</h2>
      <input
        type="text"
        placeholder="Schedule ID"
        value={scheduleId}
        onChange={(e) => setScheduleId(e.target.value)}
      />
      <button onClick={handleDeleteSchedule}>Delete Schedule</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default DeleteSchedule;
