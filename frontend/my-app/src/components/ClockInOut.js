import React, { useState } from 'react';
import { clockIn, clockOut } from '../api';
import "./Login.css";
const ClockInOut = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // New state for message type
  const [duration, setDuration] = useState(''); // State to store duration

  const handleClockIn = async () => {
    try {
      const response = await clockIn(employeeId);
      setMessage(response.message || 'Clock-in successful');
      setMessageType('success'); // Set success type
      setDuration(''); // Clear duration on clock-in
    } catch (error) {
      setMessage(error.error || 'Error during clock-in');
      setMessageType('error'); // Set error type
      setDuration('');
    }
  };

  const handleClockOut = async () => {
    try {
      const response = await clockOut(employeeId);
      setMessage(response.message || 'Clock-out successful');
      setMessageType('success'); // Set success type
      setDuration(response.duration || ''); // Set the duration from the response
    } catch (error) {
      setMessage(error.error || 'Error during clock-out');
      setMessageType('error'); // Set error type
      setDuration('');
    }
  };

  return (
    <div>
      <h1>Clock In/Out</h1>
      <input
        type="text"
        placeholder="Enter Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      />
      <div className="button-group-horiaontal">
        <button onClick={handleClockIn}>Clock In</button>
        <button onClick={handleClockOut}>Clock Out</button>
      </div>
      <p className={`response-message ${messageType}`}>{message}</p>
      {duration && <p className="response-message success">Duration: {duration}</p>}
    </div>
  );
};

export default ClockInOut;
