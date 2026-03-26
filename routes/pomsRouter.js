const express = require('express');
const router = express.Router();
const pomController = require('../controllers/pomsController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/pomsPOST', authenticateToken, pomController.createPom);

router.get('/poms', authenticateToken, pomController.getPoms);

router.get('/poms/last', authenticateToken, pomController.getLastPom);

router.get('/poms/by-date', authenticateToken, pomController.getPomodorosByDate);

router.post('/poms/save-incomplete', authenticateToken, pomController.saveUncompletedPom);

router.get('/poms/incomplete', authenticateToken, pomController.getUncompletedPomodoros);

router.delete('/pomRemove/:id', authenticateToken, pomController.deletePom) ;

router.post('/sendNoticationPom', authenticateToken , pomController.sendNotificationPom);

router.get('/getNotifichePom', authenticateToken, pomController.getNotifichePom);

router.delete('/rifiutaNotifica/:id', authenticateToken , pomController.rifiutaNotifica);

router.post('/iniziaPomodoro/:id' , authenticateToken , pomController.iniziaPomodoro);

router.get('/sessioniNonPartiteq', authenticateToken, pomController.pomNonPartiti);


module.exports = router;
