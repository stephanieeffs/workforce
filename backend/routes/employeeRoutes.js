const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { verifyEmployeeLogin } = require('../middleware/authMiddleware');

// Clock in route
router.post('/clock-in', verifyEmployeeLogin, employeeController.clockIn);

// Clock out route
router.post('/clock-out', verifyEmployeeLogin, employeeController.clockOut);

// View shift route
router.get('/view-shift', verifyEmployeeLogin, employeeController.viewShift);

module.exports = router;