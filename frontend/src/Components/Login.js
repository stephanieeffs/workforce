// components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';


const Login = () => {
    const [role, setRole] = useState('employee');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleIdChange = (e) => {
        setId(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const endpoint = role === 'manager' ? '/api/login/manager' : '/api/login/employee';
            const response = await axios.post(endpoint, {
                manager_id: role === 'manager' ? id : undefined,
                employee_id: role === 'employee' ? id : undefined,
                password,
            });

            if (response.status === 200) {
                // Handle successful login (e.g., redirect to dashboard)
                alert('Login successful');
                // Redirect user (Example):
                window.location.href = role === 'manager' ? '/manager-dashboard' : '/employee-dashboard';
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error);
            } else {
                setError('An error occurred while logging in. Please try again.');
            }
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
