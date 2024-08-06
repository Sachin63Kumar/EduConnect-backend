const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  registerStudents,
  getStudentCourses,
} = require("../controllers/courseController");

const router = express.Router();

router.route("/student").get(protect, getStudentCourses);
router.route("/").post(protect, createCourse).get(protect, getCourses);
router
  .route("/:id")
  .get(protect, getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

router.route("/:id/register").post(protect, registerStudents);

module.exports = router;
