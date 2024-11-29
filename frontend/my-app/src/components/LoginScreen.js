import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./LoginScreenView.css";

function LoginScreen() {
  const navigate = useNavigate();

  const handleEmployeeLogin = () => {
    navigate('/login/employee');
  };

  const handleManagerLogin = () => {
    navigate('/login/manager');
  };

  return (
    <div className="login-screen">
      <div className="login-box">
        <h2>Select Login Type</h2>
        <button onClick={handleEmployeeLogin}>Employee Login</button>
        <button onClick={handleManagerLogin}>Manager Login</button>
      </div>
    </div>
  );
}

export default LoginScreen;
