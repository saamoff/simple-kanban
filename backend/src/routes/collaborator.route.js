const express = require("express");
const router = express.Router();
const { getCollaborators, createCollaborator, getCollaboratorTasks } = require("../controllers/collaborator.controller.js")

router.get("/", getCollaborators);
router.get("/:id/tasks", getCollaboratorTasks);

router.post("/", createCollaborator);

module.exports = router;