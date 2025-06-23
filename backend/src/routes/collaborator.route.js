const authMiddleware = require('../middleware/authMiddleware.js');
const express = require("express");
const router = express.Router();
const { getCollaborators, createCollaborator, getCollaboratorTasks } = require("../controllers/collaborator.controller.js")

router.get("/", authMiddleware, getCollaborators);
router.get("/:id/tasks", authMiddleware, getCollaboratorTasks);

router.post("/", authMiddleware, createCollaborator);

module.exports = router;