const db = require('../config/db'); // Database connection

// Create a shift
exports.createShift = (req, res) => {
    const { employee_id, shift_date, start_time, end_time } = req.body;

    if (!employee_id || !shift_date || !start_time || !end_time) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (new Date(`1970-01-01T${end_time}`) <= new Date(`1970-01-01T${start_time}`)) {
        return res.status(400).json({ error: 'End time must be after start time' });
    }

    const singleShiftPerDayQuery = `
        SELECT * FROM shifts
        WHERE employee_id = ?
        AND shift_date = ?
    `;

    db.query(singleShiftPerDayQuery, [employee_id, shift_date], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.length > 0) {
            return res.status(409).json({ error: 'Employee already has a shift on this date' });
        }

        const insertQuery = `
            INSERT INTO shifts (employee_id, shift_date, start_time, end_time)
            VALUES (?, ?, ?, ?)
        `;

        db.query(insertQuery, [employee_id, shift_date, start_time, end_time], (err) => {
            if (err) {
                console.error('Error inserting shift:', err);
                return res.status(500).json({ error: 'Failed to create shift' });
            }
            res.status(201).json({ message: 'Shift created successfully' });
        });
    });
};

// View shifts
exports.viewShifts = (req, res) => {
    const { employee_id, password } = req.query;
    console.log("Check" + employee_id + password) // Use query for GET request parameters

    if (!employee_id || !password) {
        return res.status(400).json({ error: 'Employee ID and password are required' });
    }

    db.query('SELECT * FROM employees WHERE employee_id = ?', [employee_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const employee = result[0];
        if (employee.password !== password) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const query = 'SELECT * FROM shifts WHERE employee_id = ?';
        db.query(query, [employee_id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch shifts' });
            }

            const formattedShifts = results.map((shift) => {
                const shiftDate = new Date(shift.shift_date);
                const dayOfWeek = shiftDate.toLocaleString('en-US', { weekday: 'long' });

                return {
                    ...shift,
                    day_of_week: dayOfWeek,
                    formatted_date: shiftDate.toLocaleDateString('en-US'),
                };
            });

            res.status(200).json({
                message: 'Shifts retrieved successfully',
                shifts: formattedShifts,
            });
        });
    });
};

// Delete a shift
exports.deleteShift = (req, res) => {
    const { shift_id } = req.params;

    if (!shift_id) {
        return res.status(400).json({ error: 'Shift ID is required' });
    }

    const deleteQuery = 'DELETE FROM shifts WHERE shift_id = ?';
    db.query(deleteQuery, [shift_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete shift' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Shift not found' });
        }

        res.status(200).json({ message: 'Shift deleted successfully' });
    });
};

// Edit a shift
exports.editShift = (req, res) => {
    const { shift_id } = req.params;
    const { shift_date, start_time, end_time } = req.body;

    if (!shift_id || !shift_date || !start_time || !end_time) {
        return res.status(400).json({ error: 'Shift ID, date, start time, and end time are required' });
    }

    if (new Date(`1970-01-01T${end_time}`) <= new Date(`1970-01-01T${start_time}`)) {
        return res.status(400).json({ error: 'End time must be after start time' });
    }

    const updateQuery = `
        UPDATE shifts
        SET shift_date = ?, start_time = ?, end_time = ?
        WHERE shift_id = ?
    `;

    db.query(updateQuery, [shift_date, start_time, end_time, shift_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update shift' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Shift not found' });
        }

        res.status(200).json({ message: 'Shift updated successfully' });
    });
};
