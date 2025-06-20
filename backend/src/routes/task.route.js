const express = require("express");
const router = express.Router();
const { getTasks, getTask, createTask, updateTask, deleteTask, associateCollaborator } = require("../controllers/task.controller.js")

router.get("/", getTasks);
router.get("/:id", getTask);

router.post("/", createTask);
router.post("/:taskId/collaborators", associateCollaborator)

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

module.exports = router;