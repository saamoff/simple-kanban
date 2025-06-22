const express = require('express');
const router = express.Router();
const { startTime, stopTime, getStats, getTimeTracker, getActiveTracking } = require('../controllers/timeTracker.controller')

router.post('/time-trackers/tasks/:taskId/start', startTime);
router.post('/time-trackers/tasks/:taskId/stop', stopTime);

router.get('/time-trackers/tasks/:taskId', getTimeTracker);
router.get('/time-trackers/tasks/:taskId/active', getActiveTracking);
router.get('/time-trackers/summary', getStats);

module.exports = router;