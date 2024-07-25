const User = require("../models/User");
const TimeTable = require("../models/TimeTable");

const getFacultyInformation = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const timetable = await TimeTable.findOne({ user: userId });
    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    res.json({
      facultyName: user.name,
      schedule: timetable.schedule,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getFacultyInformation,
};
