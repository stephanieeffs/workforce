const mysql = require('mysql');

// Create a connection to the MySQL database (MariaDB)
const db = mysql.createConnection({
    host: 'localhost', // MySQL is running on the local machine
    user: 'root',      // MySQL username 
    password: '061502kp',  // 
    database: 'attendance_system' 
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to the database.');
});

module.exports = db;
