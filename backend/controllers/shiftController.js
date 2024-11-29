const db = require('../config/db'); // Database connection

exports.createShift = (req, res) => {
    const manager_id = req.headers['manager-id'];
    const password = req.headers['password1'];
    const { employee_id, shift_date, start_time, end_time } = req.body;

    console.log('Headers received:', { manager_id, password });
    console.log('Body received:', { employee_id, shift_date, start_time, end_time });

    if (!manager_id || !password) {
        console.log('Authentication failed: Missing credentials');
        return res.status(401).json({ error: 'Authentication required: Missing credentials.' });
    }

    if (!employee_id || !shift_date || !start_time || !end_time) {
        console.log('Validation failed: Missing fields');
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Example: Log validation of shift timings
    if (new Date(`1970-01-01T${end_time}`) <= new Date(`1970-01-01T${start_time}`)) {
        console.log('Validation failed: End time must be after start time');
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
            console.log('Validation failed: Shift already exists for this date');
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
            console.log('Shift created successfully:', { employee_id, shift_date, start_time, end_time });
            res.status(201).json({ message: 'Shift created successfully' });
        });
    });
};


// View shifts
exports.viewShifts = (req, res) => {
    const employee_id = req.query.employee_id || req.body.employee_id || req.headers['employee-id'];
    const password = req.query.password || req.body.password || req.headers['password'];
    const manager_id = req.query.manager_id || req.body.manager_id || req.headers['manager-id'];
    console.log('Request Query:', req.query);
    console.log('Request Body:', req.body);
    console.log('Request Headers:', req.headers);



    console.log('Employee ID:', employee_id);
    console.log('Manager ID:', manager_id);
    console.log('Password:', password);

    if (!employee_id && !manager_id) {
        return res.status(400).json({ error: 'Employee ID or Manager ID is required' });
    }

    if (!password && !manager_id) {
        return res.status(400).json({ error: 'Password or Manager ID is required' });
    }

    if (employee_id && password) {
        // Employee-specific shifts
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
            db.query('SELECT * FROM shifts WHERE employee_id = ?', [employee_id], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to fetch shifts' });
                }
                const formattedShifts = results.map(shift => ({
                    ...shift,
                    day_of_week: new Date(shift.shift_date).toLocaleString('en-US', { weekday: 'long' }),
                    formatted_date: new Date(shift.shift_date).toLocaleDateString('en-US'),
                }));
                res.status(200).json({ message: 'Shifts retrieved successfully', shifts: formattedShifts });
            });
        });
    } else if (manager_id) {
        // Manager-specific shifts
        db.query('SELECT * FROM managers WHERE manager_id = ?', [manager_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database query failed' });
            }
            if (result.length === 0) {
                return res.status(404).json({ error: 'Manager not found' });
            }

            // Fetch shifts assigned to the manager
            db.query('SELECT * FROM shifts WHERE manager_id = ?', [manager_id], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to fetch shifts' });
                }

                const formattedShifts = results.map(shift => ({
                    ...shift,
                    day_of_week: new Date(shift.shift_date).toLocaleString('en-US', { weekday: 'long' }),
                    formatted_date: new Date(shift.shift_date).toLocaleDateString('en-US'),
                }));

                res.status(200).json({ message: 'Shifts retrieved successfully', shifts: formattedShifts });
            });
        });
    }
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
