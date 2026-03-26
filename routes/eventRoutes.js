const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/events', authenticateToken, eventController.createEvent);

router.get('/eventsGET', authenticateToken, eventController.getEvents);

router.get('/events/last', authenticateToken, eventController.getLastEvent);

router.get('/events/current-day', authenticateToken, eventController.getCurrentDayEvents);

router.get('/events/by-date', authenticateToken, eventController.getEventByDate);

router.delete('/eventsRemove/:id', authenticateToken, eventController.deleteEvents) ;


router.post('/nonDisponibile' , authenticateToken , eventController.nonDisponibile);

router.get('/nonDisponibileGET', authenticateToken , eventController.nonDisponibileGET);

router.delete('/rimNonDisponibile', authenticateToken , eventController.rimNonDisponibile);

module.exports = router;
