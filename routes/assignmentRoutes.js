const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const bucket = require("../config/firebase");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB file size limit
});

const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  submitAssignment,
  getSubmissions,
  assignMarks,
} = require("../controllers/assignmentController");

router.post("/add", upload.single("file"), createAssignment);
router.get("/:courseId", getAssignments);
router.get("/assignment/:assignmentId", getAssignmentById);
router.post("/submit", upload.single("file"), submitAssignment);
router.get("/submissions/:assignmentId", getSubmissions);
router.post("/assign-marks", assignMarks);

module.exports = router;
