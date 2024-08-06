const TimeTable = require("../models/TimeTable");

const getTimeTable = async (req, res) => {
  try {
    const timeTable = await TimeTable.findOne({ user: req.user._id });
    if (timeTable) {
      res.json(timeTable);
    } else {
      res.status(404).json({ message: "Time table not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTimeTable = async (req, res) => {
  try {
    const timeTable = new TimeTable({
      user: req.user._id,
      schedule: req.body.schedule,
    });
    const createdTimeTable = await timeTable.save();
    res.status(201).json(createdTimeTable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTimeTable = async (req, res) => {
  try {
    const timeTable = await TimeTable.findOne({ user: req.user._id });
    if (timeTable) {
      timeTable.schedule = req.body.schedule;
      const updatedTimeTable = await timeTable.save();
      res.json(updatedTimeTable);
    } else {
      res.status(404).json({ message: "Time table not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTimeTable = async (req, res) => {
  try {
    const timeTable = await TimeTable.findOne({ user: req.user._id });
    if (timeTable) {
      await timeTable.remove();
      res.json({ message: "Time table removed" });
    } else {
      res.status(404).json({ message: "Time table not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTimeTable,
  createTimeTable,
  updateTimeTable,
  deleteTimeTable,
};
