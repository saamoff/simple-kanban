/**
 * @swagger
 * tags:
 *   name: Time Tracking
 *   description: Time tracking management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TimeTracker:
 *       type: object
 *       required:
 *         - task
 *         - startDate
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         task:
 *           type: string
 *           example: 507f1f77bcf86cd799439012
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: 2023-06-15T09:30:00Z
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: 2023-06-15T11:45:00Z
 *         timeZone:
 *           type: string
 *           example: America/New_York
 *         duration:
 *           type: number
 *           description: Duration in milliseconds (calculated field)
 *           example: 8100000
 *     TimeStartRequest:
 *       type: object
 *       required:
 *         - timeZone
 *       properties:
 *         timeZone:
 *           type: string
 *           example: America/New_York
 *     ActiveTrackingStatus:
 *       type: object
 *       properties:
 *         isActive:
 *           type: boolean
 *           example: true
 *         trackingData:
 *           $ref: '#/components/schemas/TimeTracker'
 *     TimeStats:
 *       type: object
 *       properties:
 *         dailyTotal:
 *           type: string
 *           example: "02:30"
 *         monthlyTotal:
 *           type: string
 *           example: "45:15"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Error message describing the issue
 */

/**
 * @swagger
 * /api/time-trackers/tasks/{taskId}/start:
 *   post:
 *     summary: Start time tracking for a task
 *     tags: [Time Tracking]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task to track time for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TimeStartRequest'
 *     responses:
 *       201:
 *         description: Time tracking started successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimeTracker'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               alreadyTracking:
 *                 value:
 *                   error: Already tracking time for this task
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /api/time-trackers/tasks/{taskId}/stop:
 *   post:
 *     summary: Stop time tracking for a task
 *     tags: [Time Tracking]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task to stop tracking
 *     responses:
 *       200:
 *         description: Time tracking stopped successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimeTracker'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No active time tracking found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: No active time tracking found
 */

/**
 * @swagger
 * /api/time-trackers/tasks/{taskId}:
 *   get:
 *     summary: Get time tracking history for a task
 *     tags: [Time Tracking]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task to get tracking history for
 *     responses:
 *       200:
 *         description: List of completed time tracking sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TimeTracker'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /api/time-trackers/tasks/{taskId}/active:
 *   get:
 *     summary: Check active time tracking status for a task
 *     tags: [Time Tracking]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task to check
 *     responses:
 *       200:
 *         description: Active tracking status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActiveTrackingStatus'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /api/time-trackers/summary:
 *   get:
 *     summary: Get time tracking statistics
 *     tags: [Time Tracking]
 *     responses:
 *       200:
 *         description: Time tracking statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimeStats'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

const express = require('express');
const router = express.Router();
const { startTime, stopTime, getStats, getTimeTracker, getActiveTracking } = require('../controllers/timeTracker.controller')

router.post('/time-trackers/tasks/:taskId/start', startTime);
router.post('/time-trackers/tasks/:taskId/stop', stopTime);

router.get('/time-trackers/tasks/:taskId', getTimeTracker);
router.get('/time-trackers/tasks/:taskId/active', getActiveTracking);
router.get('/time-trackers/summary', getStats);

module.exports = router;