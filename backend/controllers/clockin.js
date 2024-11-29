// controllers/clockInController.js
const db = require('../config/db'); // Your database connection file

exports.clockIn = (req, res) => {
    const { employee_id } = req.body;

    if (!employee_id) {
        return res.status(400).json({ error: 'Employee ID is required' });
    }

    // Validate employee_id format (e.g., must be numeric)
    const idPattern = /^[0-9]+$/;
    if (!idPattern.test(employee_id)) {
        return res.status(400).json({ error: 'Invalid Employee ID format' });
    }

    // Ensure the employee exists in the database (optional: Insert if missing)
    db.query('SELECT * FROM employees WHERE employee_id = ?', [employee_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed while checking employee.' });
        }

        if (result.length === 0) {
            // Optional: Add a new employee if not found (for testing purposes)
            db.query(
                'INSERT INTO employees (employee_id, employee_name) VALUES (?, ?)',
                [employee_id, 'Test Employee'],
                (insertErr) => {
                    if (insertErr) {
                        return res.status(500).json({ error: 'Failed to insert new employee for testing.' });
                    }
                    console.log(`Test employee with ID ${employee_id} added to database.`);
                }
            );

            return res.status(404).json({ error: 'Employee not found, but test employee has been added.' });
        }

        // Log the clock-in time
        const clockInTime = new Date();
        db.query(
            'INSERT INTO clock_in_out_logs (employee_id, clock_in_time) VALUES (?, ?)',
            [employee_id, clockInTime],
            (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to log clock-in time' });
                }

                return res.status(200).json({
                    message: 'Clock-in successful',
                    clock_in_time: clockInTime,
                });
            }
        );
    });
};

exports.clockOut = (req, res) => {
    const { employee_id } = req.body;

    if (!employee_id) {
        return res.status(400).json({ error: 'Employee ID is required' });
    }

    console.log(`Clock-out request received for employee_id: ${employee_id}`);

    // Find the most recent clock-in record with no clock-out time
    db.query(
        'SELECT * FROM clock_in_out_logs WHERE employee_id = ? AND clock_out_time IS NULL ORDER BY clock_in_time DESC LIMIT 1',
        [employee_id],
        (err, result) => {
            if (err) {
                console.error('Error querying database:', err);
                return res.status(500).json({ error: 'Database query failed' });
            }

            if (result.length === 0) {
                console.log('No active clock-in record found for employee:', employee_id);
                return res.status(404).json({ error: 'No active clock-in record found for this employee' });
            }

            const clockInRecord = result[0];
            const clockOutTime = new Date();

            console.log('Updating clock-out time for log_id:', clockInRecord.log_id);

            // Update the record with the clock-out time
            db.query(
                'UPDATE clock_in_out_logs SET clock_out_time = ? WHERE log_id = ?',
                [clockOutTime, clockInRecord.log_id],
                (err, updateResult) => {
                    if (err) {
                        console.error('Error updating clock-out time:', err);
                        return res.status(500).json({ error: 'Failed to log clock-out time' });
                    }

                    console.log('Clock-out updated for log_id:', clockInRecord.log_id);

                    // Calculate duration
                    const clockInTime = new Date(clockInRecord.clock_in_time);
                    const durationMs = clockOutTime - clockInTime;
                    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
                    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

                    return res.status(200).json({
                        message: 'Clock-out successful',
                        clock_in_time: clockInRecord.clock_in_time,
                        clock_out_time: clockOutTime,
                        duration: `${durationHours} hours and ${durationMinutes} minutes`,
                    });
                }
            );
        }
    );
};
