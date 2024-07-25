const Course = require("../models/Course");

exports.getStudentsByCourse = async (courseId) => {
  const course = await Course.findById(courseId).populate("students", "_id");
  return course.students;
};
