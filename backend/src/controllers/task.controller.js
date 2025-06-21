const Task = require("../models/task.model.js")

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({}).populate('collaborators', 'name')
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate('collaborators', 'name')
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    const populatedTask = await Task.findById(task._id).populate('collaborators', 'name')
    res.status(200).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true }).populate('collaborators', 'name')

    if(!task) {
      return res.status(404).json({message: "Task not found."})
    }

    res.status(200).json(task)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(updatedTask);
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
    const { taskId } = req.params;
    const { collaboratorIds } = req.body;

    if (!Array.isArray(collaboratorIds)) {
      return res.status(400).json({ message: "collaboratorIds must be an array" });
    }

    const task = await Task.findByIdAndUpdate(
      taskId,
      { $addToSet: { collaborators: { $each: collaboratorIds } } },
      { new: true }
    ).populate('collaborators', 'name');

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeCollaborator = async (req, res) => {
  try {
    const { taskId, collaboratorId } = req.params;

    const task = await Task.findByIdAndUpdate(
      taskId,
      { $pull: { collaborators: collaboratorId } },
      { new: true }
    ).populate('collaborators', 'name');

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

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
  updateTaskStatus,
  deleteTask,
  associateCollaborator,
  removeCollaborator
}
