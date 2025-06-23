const authMiddleware = require('../middleware/authMiddleware.js');
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

router.get("/", authMiddleware, getTasks);
router.get("/:id", authMiddleware, getTask);

router.post("/", authMiddleware, createTask);
router.post("/:taskId/collaborators", authMiddleware, associateCollaborator);

router.put("/:id", authMiddleware, updateTask);
router.patch("/:id/status", authMiddleware, updateTaskStatus);

router.delete("/:id", authMiddleware, deleteTask);
router.delete('/:taskId/collaborators/:collaboratorId', authMiddleware, removeCollaborator);

module.exports = router;