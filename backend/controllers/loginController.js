const passport = require('passport');

// Login function for managers
exports.managerLogin = (req, res, next) => {
    passport.authenticate('manager-local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error during manager authentication.' });
        }
        if (!user) {
            return res.status(401).json({ error: info.message || 'Manager authentication failed.' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to log in manager.' });
            }
            return res.status(200).json({ message: 'Manager login successful.', user });
        });
    })(req, res, next);
};

// Login function for employees
exports.employeeLogin = (req, res, next) => {
    passport.authenticate('employee-local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error during employee authentication.' });
        }
        if (!user) {
            return res.status(401).json({ error: info.message || 'Employee authentication failed.' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to log in employee.' });
            }
            return res.status(200).json({ message: 'Employee login successful.', user });
        });
    })(req, res, next);
};

// Logout function
exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out.' });
        }
        res.status(200).json({ message: 'Logout successful.' });
    });
};
