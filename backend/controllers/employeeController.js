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
    const { employee_id } = req.query;

    console.log('Received employee_id:', employee_id);

    if (!employee_id) {
        return res.status(400).json({ error: 'Employee ID is required' });
    }

    const query = `
        SELECT shift_id, shift_date, start_time, end_time
        FROM shifts
        WHERE employee_id = ?
        ORDER BY shift_date, start_time
    `;

    db.query(query, [employee_id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Failed to fetch shifts' });
        }

        console.log('Query results:', results);

        if (results.length === 0) {
            return res.status(404).json({ error: 'No shifts found for this employee' });
        }

        const formattedShifts = results.map((shift) => {
            const shiftDate = new Date(shift.shift_date);
            const dayOfWeek = shiftDate.toLocaleString('en-US', { weekday: 'long' });

            return {
                ...shift,
                formatted_date: shiftDate.toLocaleDateString('en-US'),
                day_of_week: dayOfWeek,
            };
        });

        console.log('Formatted shifts:', formattedShifts);

        return res.status(200).json({
            message: 'Shifts retrieved successfully',
            shifts: formattedShifts,
        });
    });
};


  // View schedule function for employees
exports.viewSchedule = (req, res) => {
    const { employee_id } = req.query; // Assuming employee_id is passed as a query parameter

    if (!employee_id) {
        return res.status(400).json({ error: 'Employee ID is required to view the schedule.' });
    }

    const query = 'SELECT * FROM schedules WHERE employee_id = ?';

    db.query(query, [employee_id], (err, results) => {
        if (err) {
            console.error('Error fetching schedule:', err);
            return res.status(500).json({ error: 'Failed to fetch schedule.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No schedule found for this employee.' });
        }

        res.status(200).json({
            message: 'Schedule retrieved successfully',
            schedule: results,
        });
    });
};

