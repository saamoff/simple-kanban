const express = require("express");
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  associateCollaborator,
  removeCollaborator
} = require("../controllers/task.controller.js");

router.get("/", getTasks);
router.get("/:id", getTask);

router.post("/", createTask);
router.post("/:taskId/collaborators", associateCollaborator);

router.put("/:id", updateTask);
router.patch("/:id/status", updateTaskStatus);

router.delete("/:id", deleteTask);
router.delete('/:taskId/collaborators/:collaboratorId', removeCollaborator);

module.exports = router;