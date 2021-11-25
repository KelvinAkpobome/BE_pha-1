const express = require('express');

const router = express.Router();
const { verifyToken, checkIfClient } = require('../middlewares/authentication');
const inspection = require('../controllers/inspectionController');

// post listings route
router.post('/inspection/add/:bookingId', verifyToken, checkIfClient, inspection.scheduleInspection);
router.put('/inspection/rsch/:bookingId', verifyToken, checkIfClient, inspection.rescheduleInspection);
router.delete('/inspection/rm/:bookingId', verifyToken, checkIfClient, inspection.cancelInspection);

module.exports = router;
