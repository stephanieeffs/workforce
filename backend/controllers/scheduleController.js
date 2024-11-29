const { json } = require('body-parser');
const db = require('../config/db');


exports.createSchedule = (req, res) => {
  const { employee_id } = req.body;

  if (!employee_id) {
    return res.status(400).json({ success: false, message: "Employee ID is required" });
  }

  // Check if the schedule already exists for this employee
  const checkScheduleQuery = `SELECT * FROM schedules WHERE employee_id = ?`;

  db.query(checkScheduleQuery, [employee_id], (err, existingSchedules) => {
    if (err) {
      console.error("Error checking schedules:", err);
      return res.status(500).json({ success: false, message: "Failed to check existing schedules" });
    }

    if (existingSchedules.length > 0) {
      return res.status(409).json({ success: false, message: "Schedule already exists for this employee" });
    }

    // Insert all shifts into the schedules table
    const fetchShiftsQuery = `
      SELECT shift_date, start_time, end_time
      FROM shifts
      WHERE employee_id = ?
      ORDER BY shift_date, start_time
    `;

    db.query(fetchShiftsQuery, [employee_id], (err, shifts) => {
      if (err) {
        console.error("Error fetching shifts:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch shifts" });
      }

      if (shifts.length === 0) {
        return res.status(404).json({ success: false, message: "No shifts found for this employee" });
      }

      // Insert each shift into the schedules table
      const insertScheduleQuery = `
        INSERT INTO schedules (employee_id, shift_date, start_time, end_time)
        VALUES (?, ?, ?, ?)
      `;

      const shiftInsertPromises = shifts.map((shift) => {
        return new Promise((resolve, reject) => {
          db.query(
            insertScheduleQuery,
            [employee_id, shift.shift_date, shift.start_time, shift.end_time],
            (err) => {
              if (err) reject(err);
              resolve();
            }
          );
        });
      });

      Promise.all(shiftInsertPromises)
        .then(() => {
          // Format the schedule
          const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
          const schedule = daysOfWeek.map((day) => ({
            day,
            shifts: []
          }));

          shifts.forEach((shift) => {
            const shiftDate = new Date(shift.shift_date);
            const dayOfWeek = shiftDate.toLocaleString("en-US", { weekday: "long" });

            const dayEntry = schedule.find((entry) => entry.day === dayOfWeek);
            if (dayEntry) {
              dayEntry.shifts.push({
                date: shiftDate.toLocaleDateString("en-US"),
                start_time: shift.start_time,
                end_time: shift.end_time,
              });
            }
          });

          return res.status(201).json({
            success: true,
            message: "Schedule created successfully",
            employee_id,
            schedule,
          });
        })
        .catch((err) => {
          console.error("Error inserting schedule:", err);
          return res.status(500).json({ success: false, message: "Failed to create schedule" });
        });
    });
  });
};

exports.getAllSchedules = (req, res) => {
  const query = `
      SELECT 
          s.schedule_id,
          e.employee_id,
          e.employee_name,
          sh.shift_date,
          sh.start_time,
          sh.end_time
      FROM schedules s
      JOIN employees e ON s.employee_id = e.employee_id
      JOIN shifts sh ON sh.employee_id = e.employee_id
      ORDER BY sh.shift_date, sh.start_time, e.employee_id;
  `;

  db.query(query, (err, results) => {
      if (err) {
          console.error("Error fetching schedules:", err);
          return res.status(500).json({ success: false, message: "Failed to fetch schedules" });
      }

      if (results.length === 0) {
          return res.status(404).json({ success: false, message: "No schedules found" });
      }

      // Initialize days of the week
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const schedulesByDay = daysOfWeek.map((day) => ({
          day,
          shifts: []
      }));

      // Process results
      results.forEach((shift) => {
          const shiftDate = new Date(shift.shift_date);
          const dayOfWeek = shiftDate.toLocaleString("en-US", { weekday: "long" });

          const dayEntry = schedulesByDay.find((entry) => entry.day === dayOfWeek);
          if (dayEntry) {
              dayEntry.shifts.push({
                  employee_id: shift.employee_id,
                  employee_name: shift.employee_name,
                  date: shiftDate.toLocaleDateString("en-US"),
                  start_time: shift.start_time,
                  end_time: shift.end_time,
              });
          }
      });

      res.status(200).json({
          success: true,
          message: "Schedules retrieved successfully",
          schedule: schedulesByDay,
      });
  });
};


exports.editSchedule = (req, res) => {
  const { id } = req.params; // `id` is the shift_id
  const { action, shift_date, start_time, end_time } = req.body;

  if (!id) {
      return res.status(400).json({ success: false, message: "Shift ID is required" });
  }

  if (!action || !['edit', 'add', 'remove'].includes(action)) {
      return res.status(400).json({ success: false, message: "Valid action (edit, add, or remove) is required" });
  }

  switch (action) {
      case 'edit': {
          if (!shift_date || !start_time || !end_time) {
              return res.status(400).json({ success: false, message: "Shift details are required for editing" });
          }

          const updateQuery = `
              UPDATE shifts 
              SET shift_date = ?, start_time = ?, end_time = ?
              WHERE shift_id = ?
          `;

          db.query(updateQuery, [shift_date, start_time, end_time, id], (err, result) => {
              if (err) {
                  console.error("Error updating shift:", err);
                  return res.status(500).json({ success: false, message: "Failed to update shift" });
              }

              if (result.affectedRows === 0) {
                  return res.status(404).json({ success: false, message: "Shift not found" });
              }

              return res.status(200).json({ success: true, message: "Shift updated successfully" });
          });
          break;
      }
      case 'remove': {
          const deleteQuery = `DELETE FROM shifts WHERE shift_id = ?`;

          db.query(deleteQuery, [id], (err, result) => {
              if (err) {
                  console.error("Error deleting shift:", err);
                  return res.status(500).json({ success: false, message: "Failed to delete shift" });
              }

              if (result.affectedRows === 0) {
                  return res.status(404).json({ success: false, message: "Shift not found" });
              }

              return res.status(200).json({ success: true, message: "Shift removed successfully" });
          });
          break;
      }
      default:
          return res.status(400).json({ success: false, message: "Invalid action" });
  }
};



exports.deleteSchedule = (req, res) => {
  const { id } = req.params;
  const index = schedules.findIndex((sched) => sched.schedule_id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Schedule not found" });
  }
  schedules.splice(index, 1);
  res.status(200).json({
    success: true,
    message: "Schedule deleted successfully",
  });
};
exports.viewSchedule = (req, res) => {
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
      // Employee-specific schedule
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
          db.query('SELECT * FROM shifts WHERE employee_id = ? ORDER BY shift_date, start_time', [employee_id], (err, results) => {
              if (err) {
                  return res.status(500).json({ error: 'Failed to fetch schedule' });
              }
              const formattedSchedule = results.map(shift => ({
                  ...shift,
                  day_of_week: new Date(shift.shift_date).toLocaleString('en-US', { weekday: 'long' }),
                  formatted_date: new Date(shift.shift_date).toLocaleDateString('en-US'),
              }));
              res.status(200).json({ message: 'Schedule retrieved successfully', schedule: formattedSchedule });
          });
      });
  } else if (manager_id) {
      // Manager-specific schedule
      db.query('SELECT * FROM managers WHERE manager_id = ?', [manager_id], (err, result) => {
          if (err) {
              return res.status(500).json({ error: 'Database query failed' });
          }
          if (result.length === 0) {
              return res.status(404).json({ error: 'Manager not found' });
          }

          // Fetch schedule assigned to the manager
          db.query('SELECT * FROM shifts WHERE manager_id = ? ORDER BY shift_date, start_time', [manager_id], (err, results) => {
              if (err) {
                  return res.status(500).json({ error: 'Failed to fetch schedule' });
              }

              const formattedSchedule = results.map(shift => ({
                  ...shift,
                  day_of_week: new Date(shift.shift_date).toLocaleString('en-US', { weekday: 'long' }),
                  formatted_date: new Date(shift.shift_date).toLocaleDateString('en-US'),
              }));

              res.status(200).json({ message: 'Schedule retrieved successfully', schedule: formattedSchedule });
          });
      });
  }
};









