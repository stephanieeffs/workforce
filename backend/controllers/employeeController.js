const db = require('../config/db'); // Database connection
const shiftController = require('./shiftController'); // Import shiftController

// Clock in function for employees
exports.clockIn = (req, res) => {
    const { employee_id } = req.body;
    if (!employee_id) {
        return res.status(400).json({ error: 'Employee ID is required to clock in.' });
    }

    const clockInTime = new Date();
    const query = 'INSERT INTO clock_in_out_logs (employee_id, clock_in_time) VALUES (?, ?)';

    db.query(query, [employee_id, clockInTime], (err, result) => {
        if (err) {
            console.error('Error clocking in:', err);
            return res.status(500).json({ error: 'Failed to clock in.' });
        }
        res.status(200).json({ message: 'Clock-in successful', clockInTime });
    });
};

// Clock out function for employees
exports.clockOut = (req, res) => {
    const { employee_id } = req.body;
    if (!employee_id) {
        return res.status(400).json({ error: 'Employee ID is required to clock out.' });
    }

    const clockOutTime = new Date();
    const query = 'UPDATE clock_in_out_logs SET clock_out_time = ? WHERE employee_id = ? AND clock_out_time IS NULL';

    db.query(query, [clockOutTime, employee_id], (err, result) => {
        if (err) {
            console.error('Error clocking out:', err);
            return res.status(500).json({ error: 'Failed to clock out.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No active clock-in found for this employee.' });
        }
        res.status(200).json({ message: 'Clock-out successful', clockOutTime });
    });
};

// View shift function for employees
exports.viewShift = (req, res) => {
    shiftController.viewShifts(req, res);
};
