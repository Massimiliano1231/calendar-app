const express = require('express');
const router = express.Router();
const timeMachineController = require('../controllers/timeMachineController');

router.get('/getTime-machine', timeMachineController.getTimeMachineDate);

router.post('/updateTime-machine', timeMachineController.updateTimeMachineDate);

router.post('/time-machine/reset', timeMachineController.resetTimeMachineDate);


module.exports = router;
