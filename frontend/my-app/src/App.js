import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen';
import ClockInOut from './components/ClockInOut';
import Login from './components/Login';
import CreateSchedule from './components/CreateSchedule';
import CreateShift from './components/CreateShift';
import EditSchedule from './components/EditSchedules'; 
import EditShift from './components/EditShifts'; 
import DeleteSchedule from './components/DeleteSchedule';
import DeleteShift from './components/DeleteShift';
import ViewAllSchedules from './components/ViewAllSchedules';
import ViewSchedule from './components/ViewSchedule';
import ViewShifts from './components/ViewShifts';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManagerDashboard from './components/ManagerDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Welcome screen as the main landing page */}
          <Route path="/" element={<WelcomeScreen />} />

          {/* Route to clock in/out functionality */}
          <Route path="/clock-in-out" element={<ClockInOut />} />

          {/* Route to login screen (role-based login options) */}
          <Route path="/login-screen" element={<LoginScreen />} />

          {/* Route to employee and manager login */}
          <Route path="/login/employee" element={<Login role="employee" />} />
          <Route path="/login/manager" element={<Login role="manager" />} />

          {/* Route to create schedule */}
          <Route path="/create-schedule" element={<CreateSchedule />} />

          {/* Route to create shift */}
          <Route path="/create-shift" element={<CreateShift />} />

          {/* Route to edit schedule */}
          <Route path="/edit-schedule" element={<EditSchedule />} />

          {/* Route to edit shift */}
          <Route path="/edit-shift" element={<EditShift />} />

          {/* Route to delete schedule */}
          <Route path="/delete-schedule" element={<DeleteSchedule />} />

          {/* Route to delete shift */}
          <Route path="/delete-shift" element={<DeleteShift />} />

          {/* Route to view all schedules */}
          <Route path="/view-all-schedules" element={<ViewAllSchedules />} />

          {/* Route to view individual schedule */}
          <Route path="/view-schedule" element={<ViewSchedule />} />

          {/* Route to view shifts */}
          <Route path="/view-shifts" element={<ViewShifts />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
