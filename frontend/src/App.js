import React from "react";
import Login from "./Components/Login";  // Correct import statement
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Workforce Management System</h1>
        <Login />  {/* Using the Login component */}
      </header>
    </div>
  );
}

export default App;
