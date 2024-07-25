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

// const express = require("express");
// const { protect, facultyOnly } = require("../middlewares/authMiddleware");
// const {
//   getCourses,
//   createCourse,
//   updateCourse,
//   deleteCourse,
//   getFacultyCourses,
// } = require("../controllers/courseController");

// const router = express.Router();

// router
//   .route("/")
//   .get(protect, getCourses)
//   .post(protect, facultyOnly, createCourse);
// router.route("/faculty").get(protect, facultyOnly, getFacultyCourses);
// router
//   .route("/:id")
//   .put(protect, facultyOnly, updateCourse)
//   .delete(protect, facultyOnly, deleteCourse);

// module.exports = router;

// const express = require("express");
// const { protect, facultyOnly } = require("../middlewares/authMiddleware");
// const {
//   getCourses,
//   getCourseById,
//   createCourse,
//   updateCourse,
//   deleteCourse,
// } = require("../controllers/courseController");

// const router = express.Router();

// router
//   .route("/")
//   .get(protect, getCourses)
//   .post(protect, facultyOnly, createCourse);

// router
//   .route("/:id")
//   .get(protect, getCourseById)
//   .put(protect, facultyOnly, updateCourse)
//   .delete(protect, facultyOnly, deleteCourse);

// module.exports = router;

// ---------------------------------------------
// const express = require("express");
// const { protect } = require("../middlewares/authMiddleware");
// const {
//   createCourse,
//   getCourses,
//   getCourse,
//   updateCourse,
//   deleteCourse,
// } = require("../controllers/courseController");

// const router = express.Router();

// router.route("/").post(protect, createCourse).get(protect, getCourses);
// router
//   .route("/:id")
//   .get(protect, getCourse)
//   .put(protect, updateCourse)
//   .delete(protect, deleteCourse);

// module.exports = router;
// ------------------------------------

// const express = require("express");
// const { protect } = require("../middlewares/authMiddleware");
// const {
//   createCourse,
//   getCourses,
//   getCourse,
//   updateCourse,
//   deleteCourse,
// } = require("../controllers/courseController");

// const router = express.Router();

// // Route to handle creating and fetching courses
// router
//   .route("/")
//   .post(protect, createCourse) // Create a new course
//   .get(protect, getCourses); // Get all courses

// // Route to handle specific course operations
// router
//   .route("/:id")
//   .get(protect, getCourse) // Get a specific course
//   .put(protect, updateCourse) // Update a specific course
//   .delete(protect, deleteCourse); // Delete a specific course

// module.exports = router;
