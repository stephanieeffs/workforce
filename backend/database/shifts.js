const db = require('../config/db');

// Add a new shift
const addShift = (employeeID, shiftDate, startTime, endTime, role, callback) => {
    db.query(
        'INSERT INTO shifts (employeeID, shift_date, start_time, end_time, role) VALUES (?, ?, ?, ?, ?)',
        [employeeID, shiftDate, startTime, endTime, role],
        callback
    );
};

// Get all shifts
const getAllShifts = (callback) => {
    db.query('SELECT * FROM shifts', callback);
};

// Delete a shift
const deleteShift = (shiftID, callback) => {
    db.query('DELETE FROM shifts WHERE shiftID = ?', [shiftID], callback);
};

// Check for overlapping shifts
const checkShiftOverlap = (employeeID, shiftDate, startTime, endTime, callback) => {
    const overlapQuery = `
        SELECT * FROM shifts
        WHERE employee_id = ?
        AND shift_date = ?
        AND (
            (start_time <= ? AND end_time > ?)
            OR
            (start_time < ? AND end_time >= ?)
        )
    `;
    db.query(overlapQuery, [employeeID, shiftDate, startTime, startTime, endTime, endTime], callback);
};

module.exports = { addShift, getAllShifts, deleteShift, checkShiftOverlap };
