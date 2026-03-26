const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/get-latest-alert', authenticateToken, alertController.getLatestAlerts);



module.exports = router;
