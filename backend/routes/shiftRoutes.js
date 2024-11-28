const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');
const { verifyManagerLogin } = require('../middleware/authMiddleware');
console.log(shiftController);

router.post('/create-shift', verifyManagerLogin, shiftController.createShift);// Create a shift 
router.get('/view-shifts', shiftController.viewShifts);// View shifts - Accessible to all authenticated employees
router.put('/edit-shift/:shift_id', verifyManagerLogin, shiftController.editShift);// Edit a shift 
router.delete('/delete-shift/:shift_id', verifyManagerLogin, shiftController.deleteShift);// Delete a shift 

module.exports = router;
