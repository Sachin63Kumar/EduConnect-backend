const User = require("../models/User");
const Course = require("../models/Course");

exports.getStudentCourses = async (req, res) => {
  try {
    const courses = await Course.find({ students: req.user._id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses" });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("name email");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
};

exports.registerStudents = async (req, res) => {
  const { studentIds, courseId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.students.push(...studentIds);
    await course.save();

    await User.updateMany(
      { _id: { $in: studentIds } },
      { $addToSet: { courses: courseId } }
    );

    res.status(200).json({ message: "Students registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering students" });
  }
};
