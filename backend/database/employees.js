const db = require('../config/db');

// Get all employees
const getAllEmployees = (callback) => {
    db.query('SELECT * FROM employees', callback);
};

// Add a new employee
const addEmployee = (name, callback) => {
    db.query('INSERT INTO employees (employee_name) VALUES (?)', [name], callback);
};

// Find employee by ID
const findEmployeeById = (employee_id, callback) => {
    db.query('SELECT * FROM employees WHERE employeeID = ?', [employee_id], callback);
};

module.exports = { getAllEmployees, addEmployee, findEmployeeById };
