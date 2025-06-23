const authMiddleware = require('../middleware/authMiddleware.js');
const express = require("express");
const router = express.Router();
const { getProjects, getProject, createProject, updateProject, deleteProject, getProjectTasks } = require("../controllers/project.controller.js")

router.get("/", authMiddleware, getProjects);
router.get("/:id", authMiddleware, getProject);
router.get('/:id/tasks', authMiddleware, getProjectTasks)

router.post("/", authMiddleware, createProject);

router.put("/:id", authMiddleware, updateProject);

router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;