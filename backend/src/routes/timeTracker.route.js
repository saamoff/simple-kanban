const express = require('express');
const router = express.Router();
const { startTime, stopTime, getStats, getTimeTracker, getActiveTracking } = require('../controllers/timeTracker.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/time-trackers/tasks/:taskId/start', authMiddleware, startTime);
router.post('/time-trackers/tasks/:taskId/stop', authMiddleware, stopTime);

router.get('/time-trackers/tasks/:taskId', authMiddleware, getTimeTracker);
router.get('/time-trackers/tasks/:taskId/active', authMiddleware, getActiveTracking);
router.get('/time-trackers/summary', authMiddleware, getStats);

module.exports = router;