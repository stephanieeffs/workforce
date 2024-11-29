const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const shiftController = require('../controllers/shiftController');
const scheduleController = require('../controllers/scheduleController');
const { verifyManagerLogin } = require('../middleware/authMiddleware');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
console.log(managerController);
const passport = require('passport');


// Login route for managers
router.get('/login', passport.authenticate('local', {
    successRedirect: '/api/manager/dashboard', // Redirect on successful login
    failureRedirect: '/api/manager/login-failure', // Redirect on failure
    failureMessage: true
}));

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.status(200).json({ message: 'Welcome to the manager dashboard.' });
});


// Report Generation (Requires Manager Login)
router.get('/generate-report', verifyManagerLogin, managerController.generateReport);

// Adjust clock-in/out times (Requires Manager Login)
router.put('/adjust-clockinout', verifyManagerLogin, managerController.adjustClockInOut);

// Manage Individual Shifts (Create, Edit, Delete) (Requires Manager Login)
router.post('/create-shift', verifyManagerLogin, managerController.createShift); // Create a new shift
router.put('/edit-shift/:shift_id', verifyManagerLogin, managerController.editShift); // Edit a shift by ID
router.delete('/delete-shift/:shift_id', verifyManagerLogin, managerController.deleteShift); // Delete a shift by ID
router.get('/view-shift', verifyManagerLogin, shiftController.viewShifts);
router.get('/view-schedule', verifyManagerLogin, scheduleController.viewSchedule);

// Manage Shifts (General operations, Requires Manager Login)
router.post('/manage-shift', verifyManagerLogin, managerController.manageShift);
router.delete('/manage-shift', verifyManagerLogin, managerController.manageShift);

// Manage Schedules (Higher-level operations, Requires Manager Login)
router.post('/manage-schedule', verifyManagerLogin, managerController.manageSchedule);
router.delete('/manage-schedule', verifyManagerLogin, managerController.manageSchedule);

module.exports = router;
