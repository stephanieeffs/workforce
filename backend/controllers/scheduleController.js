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
  const employee_id = req.params.employee_id || req.body.employee_id; // Check both URL and body for employee_id

  if (!employee_id) {
    return res.status(400).json({ success: false, message: "Employee ID is required" });
  }

  // Fetch all shifts for the employee
  const query = `
      SELECT shift_date, start_time, end_time 
      FROM shifts 
      WHERE employee_id = ? 
      ORDER BY shift_date, start_time
  `;

  db.query(query, [employee_id], (err, results) => {
    if (err) {
      console.error("Error fetching schedule:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch schedule" });
    }

    // Create the default structure for all days of the week
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const schedule = daysOfWeek.map(day => ({
      day,
      shifts: [],
    }));

    // Populate the schedule with shifts
    results.forEach(shift => {
      const shiftDate = new Date(shift.shift_date);
      const dayOfWeek = shiftDate.toLocaleString("en-US", { weekday: "long" });

      // Find the corresponding day in the schedule
      const dayEntry = schedule.find(entry => entry.day === dayOfWeek);
      if (dayEntry) {
        dayEntry.shifts.push({
          date: shiftDate.toLocaleDateString("en-US"),
          start_time: shift.start_time,
          end_time: shift.end_time,
        });
      }
    });

    // Response with formatted schedule
    res.status(200).json({
      success: true,
      message: `Shifts for the week for Employee ID ${employee_id}`,
      schedule,
    });
  });
};




