const db = require('../config/db');
const scheduleController = require('./scheduleController');
const shiftController = require('./shiftController');

// Generate a report
exports.generateReport = (req, res) => {
    // Define the report type (for example: monthly, weekly, or daily)
    const { reportType, startDate, endDate } = req.query;

    // Basic validation for report type and dates
    if (!reportType || !startDate || !endDate) {
        return res.status(400).json({ error: 'Please provide reportType, startDate, and endDate' });
    }

    // Query the database for shifts or attendance logs in the specified time range
    const query = `
        SELECT employee_id, employee_name, shift_date, start_time, end_time 
        FROM shifts
        WHERE shift_date BETWEEN ? AND ?
        ORDER BY employee_id, shift_date;
    `;

    // Execute the query
    db.query(query, [startDate, endDate], (err, results) => {
        if (err) {
            console.error('Error fetching report data:', err);
            return res.status(500).json({ error: 'Failed to generate report' });
        }

        // Process the data into a readable format, e.g., grouping shifts by employee
        let report = {};

        results.forEach((shift) => {
            if (!report[shift.employee_id]) {
                report[shift.employee_id] = {
                    employeeName: shift.employee_name,
                    shifts: []
                };
            }

            report[shift.employee_id].shifts.push({
                date: shift.shift_date,
                startTime: shift.start_time,
                endTime: shift.end_time
            });
        });

        // Send the report as a response
        res.status(200).json({
            message: 'Report generated successfully',
            reportType: reportType,
            startDate: startDate,
            endDate: endDate,
            report: report
        });
    });
};

// Adjust clock-in/out times
exports.adjustClockInOut = (req, res) => {
    const { log_id, new_clock_in_time, new_clock_out_time } = req.body;

    if (!log_id) {
        return res.status(400).json({ error: 'Log ID is required for editing.' });
    }

    // Construct the update query
    let updateQuery = 'UPDATE clock_in_out_logs SET ';
    const updateParams = [];
    if (new_clock_in_time) {
        updateQuery += 'clock_in_time = ?, ';
        updateParams.push(new_clock_in_time);
    }
    if (new_clock_out_time) {
        updateQuery += 'clock_out_time = ?, ';
        updateParams.push(new_clock_out_time);
    }

    // Remove trailing comma
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ' WHERE log_id = ?';
    updateParams.push(log_id);

    // Perform the update in the database
    db.query(updateQuery, updateParams, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error while updating clock-in/out log' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No log found with the provided ID' });
        }
        return res.status(200).json({ message: 'Clock-in/out log updated successfully' });
    });
};

// Manage individual shifts (create, edit, delete)

exports.createShift = shiftController.createShift;
exports.editShift = shiftController.editShift;
exports.deleteShift = shiftController.deleteShift;

exports.manageShift = (req, res, next) => {
    switch (req.method) {
        case 'POST':
            // Check if this is an edit request or a creation request
            if (req.query.action === 'edit') {
                return shiftController.editShift(req, res);
            } else {
                return shiftController.createShift(req, res);
            }
        case 'DELETE':
            return shiftController.deleteShift(req, res);
        default:
            res.status(405).json({ error: 'Method not allowed' });
            break;
    }
};

// Manage schedules (schedule-level operations)
exports.createSchedule = scheduleController.createSchedule;
exports.getAllSchedules = scheduleController.getAllSchedules;
exports.getScheduleById = scheduleController.getScheduleById;
exports.editSchedule = scheduleController.editSchedule;
exports.deleteSchedule = scheduleController.deleteSchedule;
exports.assignShiftToDay = scheduleController.assignShiftToDay;


exports.manageSchedule = (req, res, next) => {
    const { action } = req.query;

    switch (req.method) {
        case 'POST':
            if (action === 'create') {
                return scheduleController.createSchedule(req, res);
            } else if (action === 'edit') {
                return scheduleController.editSchedule(req, res);
            }
            return res.status(400).json({ error: 'Invalid action for managing schedule.' });
        
        case 'DELETE':
            return scheduleController.deleteSchedule(req, res);

        default:
            res.status(405).json({ error: 'Method not allowed' });
            break;
    }
};
