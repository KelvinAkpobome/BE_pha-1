const express = require('express');
const { verifyToken, checkIfAdmin } = require('../middlewares/authentication');

const router = express.Router();
const dbTasks = require('../controllers/adminController.js');

router.get('/admin/listings/index', verifyToken, checkIfAdmin, dbTasks.indexDB);
router.get('/admin/listings/seed', verifyToken, checkIfAdmin, dbTasks.seedDB);
module.exports = router;
