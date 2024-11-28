const db = require('../config/db');

// Add a new schedule
const addSchedule = (employeeID, date, shiftDetails, callback) => {
    db.query(
        'INSERT INTO schedules (employeeID, date, shift_details) VALUES (?, ?, ?)',
        [employeeID, date, shiftDetails],
        callback
    );
};

// Get all schedules
const getAllSchedules = (callback) => {
    db.query('SELECT * FROM schedules', callback);
};

// Get a schedule by ID
const getScheduleById = (scheduleID, callback) => {
    db.query('SELECT * FROM schedules WHERE schedule_id = ?', [scheduleID], callback);
};

// Delete a schedule
const deleteSchedule = (scheduleID, callback) => {
    db.query('DELETE FROM schedules WHERE schedule_id = ?', [scheduleID], callback);
};

module.exports = { addSchedule, getAllSchedules, getScheduleById, deleteSchedule };
