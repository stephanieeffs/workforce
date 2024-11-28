import React, { useState } from 'react';
import axios from 'axios';

function DeleteShift() {
  const [shiftId, setShiftId] = useState('');
  const [message, setMessage] = useState('');

  const handleDeleteShift = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/shifts/${shiftId}`);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to delete shift');
    }
  };

  return (
    <div>
      <h2>Delete Shift</h2>
      {message && <p>{message}</p>}
      <input
        type="text"
        placeholder="Shift ID"
        value={shiftId}
        onChange={(e) => setShiftId(e.target.value)}
      />
      <button onClick={handleDeleteShift}>Delete Shift</button>
    </div>
  );
}

export default DeleteShift;
