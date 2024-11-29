const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
const { verifyManagerLogin, verifyEmployeeLogin } = require('../middleware/authMiddleware');

console.log(scheduleController);

// Define routes
router.get("/get-all-schedules", verifyManagerLogin, scheduleController.getAllSchedules); // For managers
router.get("/view-schedule",  scheduleController.viewSchedule); // For employees
router.post("/create-schedule", verifyManagerLogin, scheduleController.createSchedule); // For managers
router.put("/edit-schedule/:id", verifyManagerLogin, scheduleController.editSchedule); // For managers
router.delete("/delete-schedule/:id", verifyManagerLogin, scheduleController.deleteSchedule); // For managers

module.exports = router;
