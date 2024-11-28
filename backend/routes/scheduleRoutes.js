const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
const { verifyManagerLogin } = require('../middleware/authMiddleware');
console.log(scheduleController);


// Define routes
router.get("/", verifyManagerLogin, scheduleController.getAllSchedules);
router.get("/:id",verifyManagerLogin, scheduleController.viewSchedule); // DONE
router.post("/create-schedule", verifyManagerLogin, scheduleController.createSchedule); // DONE
router.put("/:id",verifyManagerLogin, scheduleController.editSchedule); // DONE
router.delete("/:id",verifyManagerLogin, scheduleController.deleteSchedule); // DONE

module.exports = router;
