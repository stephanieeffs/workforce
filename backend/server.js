// server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
require('./config/passportConfig'); // Import passport configuration

const authRoutes = require('./routes/authRoutes');
const managerRoutes = require('./routes/managerRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const clockInRoutes = require('./routes/clockinroutes');
const shiftRoutes = require('./routes/shiftRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');


const app = express();

// Middleware to parse JSON request body
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Set up express session
app.use(session({
    secret: 'managerpass', 
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Use the routes
app.use('/api', authRoutes);
app.use('/api', clockInRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api',employeeRoutes);


// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
