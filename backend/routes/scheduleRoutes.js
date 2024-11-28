const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
const { verifyManagerLogin } = require('../middleware/authMiddleware');
console.log(scheduleController);


// Define routes
router.get("/view-all-schedules", verifyManagerLogin, scheduleController.getAllSchedules);
router.get("/view-schedule/:id",verifyManagerLogin, scheduleController.viewSchedule); // DONE
router.post("/create-schedule", verifyManagerLogin, scheduleController.createSchedule); // DONE
router.put("/edit-schedule/:id",verifyManagerLogin, scheduleController.editSchedule); // DONE
router.delete("/delete-schedule/:id",verifyManagerLogin, scheduleController.deleteSchedule); // DONE

module.exports = router;
