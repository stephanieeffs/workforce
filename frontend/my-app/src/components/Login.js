import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [role, setRole] = useState("employee"); // Default role
  const [userId, setUserId] = useState(""); // For manager ID or employee ID
  const [password, setPassword] = useState(""); // Password input
  const [error, setError] = useState(""); // Error state
  const [success, setSuccess] = useState(""); // Success state

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setError(""); // Clear any error when switching roles
    setSuccess(""); // Clear success when switching roles
  };

  const handleIdChange = (e) => {
    setUserId(e.target.value);
    setError(""); // Clear any error when typing
    setSuccess(""); // Clear success when typing
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(""); // Clear any error when typing
    setSuccess(""); // Clear success when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Determine the endpoint based on the selected role
      const endpoint =
        role === "manager"
          ? "http://localhost:3000/api/login/manager"
          : "http://localhost:3000/api/login/employee";

      // Payload dynamically includes ID based on the role
      const payload = {
        password,
        [role === "manager" ? "manager_id" : "employee_id"]: userId,
      };

      console.log("Sending login request to:", endpoint);
      console.log("Payload:", payload);

      // Send login request
      const response = await axios.post(endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Login response received:", response.data);
      setSuccess(response.data.message || "Login successful");
      setError(""); // Clear any error on success
    } catch (err) {
      console.error("Login error response:", err.response || err.message);
      setError(err.response?.data?.error || "Login failed");
      setSuccess(""); // Clear any success on error
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="role">Select Role:</label>
          <select id="role" value={role} onChange={handleRoleChange}>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="id">{role === "manager" ? "Manager ID" : "Employee ID"}:</label>
          <input
            type="text"
            id="id"
            value={userId}
            onChange={handleIdChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
