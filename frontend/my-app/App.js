import React from 'react';
import ClockInOut from './components/ClockInOut'; // Import your custom component

function App() {
  return (
    <div className="App">
      <h1>Employee Clock In/Out</h1>
      <ClockInOut /> {/* Render your ClockInOut component */}
    </div>
  );
}

export default App;
