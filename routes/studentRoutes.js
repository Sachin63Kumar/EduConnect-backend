const express = require("express");
const { protect, facultyOnly } = require("../middlewares/authMiddleware");
const {
  getAllStudents,
  registerStudents,
  getStudentCourses,
} = require("../controllers/studentController");

const router = express.Router();

router.route("/").get(protect, facultyOnly, getAllStudents);
router.route("/courses").get(protect, getStudentCourses);
router.route("/register").post(protect, facultyOnly, registerStudents);

module.exports = router;
