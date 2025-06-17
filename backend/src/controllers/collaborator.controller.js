const Collaborator = require("../models/collaborator.model.js");

const getCollaborators = async (req, res) => {
  try {
    const collaborators = await Collaborator.find().populate('user');
    res.status(200).json(collaborators);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCollaborator = async (req, res) => {
  try {
    const collaborator = await Collaborator.create(req.body);
    res.status(201).json(collaborator);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCollaboratorTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await Task.find({ collaborators: id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCollaborator,
  getCollaborators,
  getCollaboratorTasks,
};