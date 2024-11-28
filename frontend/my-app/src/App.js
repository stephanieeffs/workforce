import React from 'react';
import ClockInOut from './components/ClockInOut'; // Import your custom component
import './App.css';
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      <h1>Workforce system</h1>
      <ClockInOut /> {/* Render your ClockInOut component */}
      <Login />
    </div>
  );
}

export default App;
