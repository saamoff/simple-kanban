const Task = require("../models/task.model.js")

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, req.body);

    if(!task) {
      return res.status(404).json({message: "Task not found."})
    }

    const updatedTask = await Task.findById(id)
    res.status(200).json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if(!task) {
      return res.status(404).json({message: "Task not found."})
    }

    res.status(200).json({message: "Task deleted."})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const associateCollaborator = async (req, res) => {
  try {
    const { taskId, collaboratorId } = req.params;
    const task = await Task.findByIdAndUpdate(
      taskId,
      { $addToSet: { collaborators: collaboratorId } },
      { new: true }
    );
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  associateCollaborator,
}
