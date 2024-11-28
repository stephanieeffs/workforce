// routes/clockinroutes.js
const express = require('express');
const router = express.Router();
const clockInController = require('../controllers/clockin');

// Map routes to controller functions
router.post('/clock-in', clockInController.clockIn);
router.post('/clock-out', clockInController.clockOut);

module.exports = router;
