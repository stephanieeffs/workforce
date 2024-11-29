const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const shiftController = require('../controllers/shiftController');
const scheduleController = require('../controllers/scheduleController');
const { verifyEmployeeLogin } = require('../middleware/authMiddleware');

// Clock in route
router.post('/clock-in', verifyEmployeeLogin, employeeController.clockIn);

// Clock out route
router.post('/clock-out', verifyEmployeeLogin, employeeController.clockOut);

router.get('/view-shift', verifyEmployeeLogin, shiftController.viewShifts);
router.get('/view-schedule', verifyEmployeeLogin, scheduleController.viewSchedule);


module.exports = router;