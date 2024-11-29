import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./WelcomeScreen.css";

function WelcomeScreen() {
  const navigate = useNavigate();

  const handlePunchCard = () => {
    navigate('/clock-in-out');
  };

  const handleLogin = () => {
    navigate('/login-screen');
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-container">
        <h1 className="welcome-title">Welcome to the Workforce Management System</h1>
        <div className="welcome-buttons">
          <button className="button-primary" onClick={handlePunchCard}>Punch Card</button>
          <button className="button-secondary" onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
  
}

export default WelcomeScreen;
