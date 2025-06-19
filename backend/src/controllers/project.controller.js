const Project = require("../models/project.model.js")
const Task = require("../models/task.model.js")

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(id, req.body);

    if(!project) {
      return res.status(404).json({message: "Project not found."})
    }

    const updatedProject = await Project.findById(id)
    res.status(200).json(updatedProject)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.deleteMany({ project: id });
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.status(200).json({ message: "Project and related tasks deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await Task.find({ project: id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectTasks,
}
