const mongoose = require("mongoose");
const Course = require("../models/Course");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.createCourse = async (req, res) => {
  const { courseName, facultyName, numOfStudentEnrolled, status } = req.body;

  try {
    const course = await Course.create({
      courseName,
      facultyName,
      numOfStudentEnrolled,
      status,
      createdBy: req.user._id,
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: "Invalid course data" });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ createdBy: req.user._id });
    res.json(courses);
  } catch (error) {
    res.status(400).json({ message: "Error fetching courses" });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course && course.createdBy.toString() === req.user._id.toString()) {
      res.json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error fetching course" });
  }
};

exports.updateCourse = async (req, res) => {
  const { courseName, facultyName, numOfStudentEnrolled, status } = req.body;

  try {
    const course = await Course.findById(req.params.id);

    if (course && course.createdBy.toString() === req.user._id.toString()) {
      course.courseName = courseName || course.courseName;
      course.facultyName = facultyName || course.facultyName;
      course.numOfStudentEnrolled =
        numOfStudentEnrolled || course.numOfStudentEnrolled;
      course.status = status || course.status;

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error updating course" });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.registerStudents = async (req, res) => {
  const { studentIds } = req.body;
  const { id } = req.params;

  try {
    const course = await Course.findById(id);

    if (course) {
      studentIds.forEach((studentId) => {
        if (!course.students.includes(studentId)) {
          course.students.push(studentId);
        }
      });
      await course.save();
      res.json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error registering students" });
  }
};

exports.getStudentCourses = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.id;

    const courses = await Course.find({ students: studentId });
    res.json(courses);
  } catch (error) {
    console.error("Detailed Error:", error);
    res.status(400).json({
      message: "Error fetching student courses",
      error: error.message,
    });
  }
};
