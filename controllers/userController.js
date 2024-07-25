const User = require("../models/User");

exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    res.json(students);
  } catch (error) {
    res.status(400).json({ message: "Error fetching students" });
  }
};
