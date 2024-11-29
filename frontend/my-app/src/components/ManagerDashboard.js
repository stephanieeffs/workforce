import React, { useState } from "react";
import { createShift, viewManagerShift, viewManagerSchedule } from "../api";

const ManagerDashboard = () => {
  const [shifts, setShifts] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    employee_id: "",
    shift_date: "",
    start_time: "",
    end_time: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateShift = async () => {
    try {
      const data = await createShift(formData);
      console.log(data.message);
      alert(data.message); // Inform the user shift was created
      setError("");
      // Optionally refresh shifts or schedule if needed
    } catch (err) {
      console.error("Error creating shift:", err);
      setError(err.response?.data?.error || "Error creating shift");
    }
  };

  const handleViewShifts = async () => {
    try {
      const managerId = localStorage.getItem("manager-id");
      const password = localStorage.getItem("password");

      if (!managerId || !password) {
        throw new Error("Missing credentials. Please log in again.");
      }

      const data = await viewManagerShift(managerId, password);
      setShifts(data.shifts);
      setError("");
    } catch (err) {
      console.error("Error fetching shifts:", err);
      setError(err.response?.data?.error || "Error fetching shifts");
    }
  };

  const handleViewSchedule = async () => {
    try {
      const managerId = localStorage.getItem("manager-id");
      const password = localStorage.getItem("password");

      if (!managerId || !password) {
        throw new Error("Missing credentials. Please log in again.");
      }

      const data = await viewManagerSchedule(managerId, password);
      setSchedule(data);
      setError("");
    } catch (err) {
      console.error("Error fetching schedule:", err);
      setError(err.response?.data?.error || "Error fetching schedule");
    }
  };

  return (
    <div>
      <h1>Manager Dashboard</h1>
      <button onClick={handleViewShifts}>View Shifts</button>
      <button onClick={handleViewSchedule}>View Schedule</button>

      <div>
        <h2>Create Shift</h2>
        <form>
          <div>
            <label>Employee ID:</label>
            <input
              type="number"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Shift Date:</label>
            <input
              type="date"
              name="shift_date"
              value={formData.shift_date}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Start Time:</label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>End Time:</label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleInputChange}
            />
          </div>
          <button type="button" onClick={handleCreateShift}>
            Create Shift
          </button>
        </form>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {shifts.length > 0 && (
        <table border="1" style={{ margin: "20px auto", width: "80%" }}>
          <thead>
            <tr>
              <th>Shift Date</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift, index) => (
              <tr key={index}>
                <td>{new Date(shift.shift_date).toLocaleDateString()}</td>
                <td>{shift.start_time}</td>
                <td>{shift.end_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {schedule.length > 0 && (
        <table border="1" style={{ margin: "20px auto", width: "80%" }}>
          <thead>
            <tr>
              <th>Schedule Date</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.shift_date).toLocaleDateString()}</td>
                <td>{item.start_time}</td>
                <td>{item.end_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManagerDashboard;
