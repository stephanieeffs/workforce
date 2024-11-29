// server.js
const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
require('./config/passportConfig'); // Import passport configuration

const authRoutes = require('./routes/authRoutes');
const managerRoutes = require('./routes/managerRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const clockInRoutes = require('./routes/clockinroutes');
const shiftRoutes = require('./routes/shiftRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const loginRoutes = require('./routes/loginRoutes');



const app = express();

//React app origin
app.use(cors({
    origin: 'http://localhost:3001', 
    credentials: true,
}));


// Middleware to parse JSON request body
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Set up express session
app.use(session({
    secret: 'managerpass', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true } 
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
app.use('/api/employee',employeeRoutes);
app.use('/api', loginRoutes);


// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
