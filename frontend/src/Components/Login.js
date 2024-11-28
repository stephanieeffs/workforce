import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [role, setRole] = useState("employee"); // Default role is employee
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      // Determine the endpoint based on the selected role
      const endpoint = `http://localhost:3000/api/login/employee`;//change endpoint based on 
      
      // Create the payload depending on the role
      const payload = {
        password,
      };
      if (role === "manager") {
        payload.manager_id = userId;
      } else {
        payload.employee_id = userId;
      }

      // Make a POST request to the backend login endpoint
      const response = await axios.post(endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      console.log("Login successful:", response.data);
      setError(""); // Clear error if login is successful
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="role">Select Role:</label>
                <select id="role" value={role} onChange={handleRoleChange}>
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="id">{role === 'manager' ? 'Manager ID' : 'Employee ID'}:</label>
                <input
                    type="text"
                    id="id"
                    value={id}
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
};

export default Login;
