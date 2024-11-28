// authRoutes.js
const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Login Routes using loginController
router.post('/login/manager', loginController.managerLogin);
router.post('/login/employee', loginController.employeeLogin);

// Logout route shared for both employees and managers
router.post('/logout', loginController.logout);

// Login failure route for both manager and employee login failures
router.get('/login-failure/:role', (req, res) => {
    const role = req.params.role;
    if (role === 'manager') {
        res.status(401).json({ error: 'Invalid manager credentials.' });
    } else if (role === 'employee') {
        res.status(401).json({ error: 'Invalid employee credentials.' });
    } else {
        res.status(400).json({ error: 'Unknown role specified.' });
    }
});

// Protected Routes
const { verifyManagerLogin, verifyEmployeeLogin } = require('../middleware/authMiddleware');

// Dashboard for managers (accessible only after login)
router.get('/manager/dashboard', verifyManagerLogin, (req, res) => {
    res.status(200).json({ message: 'Welcome to the manager dashboard.' });
});

// Dashboard for employees (accessible only after login)
router.get('/employee/dashboard', verifyEmployeeLogin, (req, res) => {
    res.status(200).json({ message: 'Welcome to the employee dashboard.' });
});

module.exports = router;
