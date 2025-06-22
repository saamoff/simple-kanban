const TimeTracker = require('../models/timeTracker.model');

const startTime = async (req, res) => {
  try {
    const { timeZone } = req.body;
    const taskId = req.params.taskId;

    const activeTracking = await TimeTracker.findOne({
      task: taskId,
      endDate: null
    });

    if (activeTracking) {
      return res.status(400).json({ error: "Already tracking time for this task" });
    }

    const timeTracker = new TimeTracker({
      task: taskId,
      startDate: new Date(),
      timeZone
    });

    await timeTracker.save();
    res.status(201).json(timeTracker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const stopTime = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const timeTracker = await TimeTracker.findOne({
      task: taskId,
      endDate: null
    });

    if (!timeTracker) {
      return res.status(404).json({ error: "No active time tracking found" });
    }

    timeTracker.endDate = new Date();
    await timeTracker.save();
    res.json(timeTracker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getTimeTracker = async (req, res) => {
  try {
    const timeTrackers = await TimeTracker.find({
      task: req.params.taskId,
      endDate: { $exists: true }
    }).sort({ startDate: -1 });

    res.json(timeTrackers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getActiveTracking = async (req, res) => {
  try {
    const activeTracking = await TimeTracker.findOne({
      task: req.params.taskId,
      endDate: null
    });
    
    res.json({ 
      isActive: !!activeTracking,
      trackingData: activeTracking || null
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const dailyTrackers = await TimeTracker.find({
      endDate: { $exists: true },
      startDate: { $gte: startOfDay }
    });

    const monthlyTrackers = await TimeTracker.find({
      endDate: { $exists: true },
      startDate: { $gte: startOfMonth }
    });

    const calculateTotal = (trackers) => {
      return trackers.reduce((total, tracker) => {
        return total + (tracker.endDate - tracker.startDate);
      }, 0);
    };

    const dailyTotal = calculateTotal(dailyTrackers);
    const monthlyTotal = calculateTotal(monthlyTrackers);

    res.json({
      dailyTotal: formatDuration(dailyTotal),
      monthlyTotal: formatDuration(monthlyTotal)
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

module.exports = {
  startTime,
  stopTime,
  getTimeTracker,
  getActiveTracking,
  getStats,
}