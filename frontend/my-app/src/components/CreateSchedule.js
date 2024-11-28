import React, { useState } from 'react';
import axios from 'axios';

function CreateSchedule() {
  const [employeeId, setEmployeeId] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateSchedule = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/schedule/create-schedule', { employee_id: employeeId });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create schedule');
    }
  };

  return (
    <div>
      <h2>Create Schedule</h2>
      <input
        type="text"
        placeholder="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      />
      <button onClick={handleCreateSchedule}>Create Schedule</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateSchedule;
