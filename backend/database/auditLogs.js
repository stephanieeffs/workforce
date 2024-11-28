const db = require('../config/db');

// Add a clock-in or clock-out log
const addLog = (employee_id, actionType, callback) => {
    db.query('INSERT INTO logs (employeeID, action_type) VALUES (?, ?)', [employee_id, actionType], callback);
};

// Log clock-in
const logClockIn = (employee_id, clockInTime, callback) => {
    db.query(
        'INSERT INTO clock_in_out_logs (employee_id, clock_in_time) VALUES (?, ?)',
        [employee_id, clockInTime],
        callback
    );
};

// Log clock-out
const logClockOut = (log_id, clockOutTime, callback) => {
    db.query(
        'UPDATE clock_in_out_logs SET clock_out_time = ? WHERE log_id = ?',
        [clockOutTime, logID],
        callback
    );
};

// Find the most recent clock-in record without clock-out
const findActiveClockIn = (employee_id, callback) => {
    db.query(
        'SELECT * FROM clock_in_out_logs WHERE employeeID = ? AND clock_out_time IS NULL ORDER BY clock_in_time DESC LIMIT 1',
        [employee_id],
        callback
    );
};


module.exports = { addLog, logClockIn, logClockOut, findActiveClockIn };