import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import "./Login.css";

function Login({ role: initialRole }) {
  const [role, setRole] = useState(initialRole || "employee");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const location = useLocation();
  const navigate = useNavigate(); // Add navigate hook

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("manager")) {
      setRole("manager");
    } else if (path.includes("employee")) {
      setRole("employee");
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        role === "manager"
          ? "http://localhost:3000/api/login/manager"
          : "http://localhost:3000/api/login/employee";
  
      const payload = {
        password,
        [role === "manager" ? "manager_id" : "employee_id"]: userId,
      };
  
      const response = await axios.post(endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("Login successful:", response.data);
  
      // Store credentials in localStorage
      if (role === "employee") {
        localStorage.setItem("employee-id", response.data.user.employee_id);
        localStorage.setItem("password", password);
      }

      if(role === 'manager'){
        localStorage.setItem("manager-id",response.data.user.manager_id);
        localStorage.setItem("password",password);
      }
  
      setSuccess(response.data.message || "Login successful");
      setError(""); // Clear any error on success
  
      // Navigate based on role
      if (role === "employee") {
        navigate("/employee-dashboard"); // Navigate to Employee Dashboard
      } else if (role === "manager") {
        navigate("/manager-dashboard"); // Update this when adding Manager Dashboard
      }
    } catch (err) {
      console.error("Login error response:", err.response || err.message);
      setError(err.response?.data?.error || "Login failed");
      setSuccess(""); // Clear any success on error
    }
  };
  

  return (
    <div className="login-container">
      <h2>{role === "manager" ? "Manager Login" : "Employee Login"}</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id">{role === "manager" ? "Manager ID" : "Employee ID"}:</label>
          <input
            type="text"
            id="id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
