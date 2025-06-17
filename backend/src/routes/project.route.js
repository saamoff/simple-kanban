const express = require("express");
const router = express.Router();
const { getProjects, getProject, createProject, updateProject, deleteProject, getProjectTasks } = require("../controllers/project.controller.js")

router.get("/", getProjects);
router.get("/:id", getProject);
router.get('/:id/tasks', getProjectTasks)

router.post("/", createProject);

router.put("/:id", updateProject);

router.delete("/:id", deleteProject);

module.exports = router;