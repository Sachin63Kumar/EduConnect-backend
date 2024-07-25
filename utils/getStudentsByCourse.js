const Course = require("../models/Course");
const User = require("../models/User");

const getStudentsByCourse = async (courseId) => {
  const course = await Course.findById(courseId).populate("students", "id");
  return course.students;
};

module.exports = getStudentsByCourse;
