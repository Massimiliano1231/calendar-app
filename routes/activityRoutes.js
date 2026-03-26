const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/activities', authenticateToken, activityController.createActivity);

router.get('/activitiesGET', authenticateToken, activityController.getActivities);

router.get('/activities/last', authenticateToken, activityController.getLastActivity);

router.get('/activities/current-day', authenticateToken, activityController.getCurrentDayActivities);

router.get('/activities/by-date', authenticateToken, activityController.getActivitiesByDate);

router.put('/activities/mark-complete', authenticateToken, activityController.markCompleted);

router.put('/activities/:id', authenticateToken, activityController.updateActivity);

router.get('/activities/overdue', authenticateToken, activityController.getOverdueActivities);

router.delete('/activitiesRemove/:id', authenticateToken, activityController.deleteActivities) ;


module.exports = router;