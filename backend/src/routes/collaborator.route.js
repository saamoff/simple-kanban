/**
 * @swagger
 * tags:
 *   name: Collaborators
 *   description: Collaborator management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Collaborator:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         name:
 *           type: string
 *           example: John Doe
 *         user:
 *           type: string
 *           example: 507f1f77bcf86cd799439012
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00Z
 *     CollaboratorWithUser:
 *       allOf:
 *         - $ref: '#/components/schemas/Collaborator'
 *         - type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *     Task:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [todo, in-progress, done]
 *         collaborators:
 *           type: array
 *           items:
 *             type: string
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Error message describing the issue
 */

/**
 * @swagger
 * /api/collaborators:
 *   get:
 *     summary: Get all collaborators
 *     tags: [Collaborators]
 *     responses:
 *       200:
 *         description: List of all collaborators
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CollaboratorWithUser'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/collaborators:
 *   post:
 *     summary: Create a new collaborator
 *     tags: [Collaborators]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Smith
 *               user:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Collaborator created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collaborator'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/collaborators/{id}/tasks:
 *   get:
 *     summary: Get all tasks assigned to a collaborator
 *     tags: [Collaborators]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Collaborator ID
 *     responses:
 *       200:
 *         description: List of tasks assigned to the collaborator
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

const express = require("express");
const router = express.Router();
const { getCollaborators, createCollaborator, getCollaboratorTasks } = require("../controllers/collaborator.controller.js")

router.get("/", getCollaborators);
router.get("/:id/tasks", getCollaboratorTasks);

router.post("/", createCollaborator);

module.exports = router;