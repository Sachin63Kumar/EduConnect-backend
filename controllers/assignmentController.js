const Assignment = require("../models/Assignment");
const Notification = require("../models/Notification");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { getStudentsByCourse } = require("../utils/courseUtils");
const bucket = require("../config/firebase");
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB file size limit
});

const createAssignment = async (req, res) => {
  try {
    let fileUrl = "";

    if (req.file) {
      const blob = bucket.file(
        `assignments/${uuidv4()}-${req.file.originalname}`
      );
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      blobStream.on("error", (error) => {
        res.status(500).json({ error: error.message });
      });

      blobStream.on("finish", async () => {
        fileUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(blob.name)}?alt=media`;

        const { courseId, title, instructions, deadline, marks } = req.body;
        const descriptionFile = fileUrl;

        const assignment = new Assignment({
          courseId,
          title,
          instructions,
          descriptionFile,
          deadline,
          marks,
        });

        await assignment.save();

        // Create notifications for students
        const students = await getStudentsByCourse(courseId);
        const notifications = students.map((student) => ({
          userId: student._id,
          courseId,
          type: "Assignment",
          message: `New assignment in course ${courseId}: ${title}`,
        }));
        await Notification.insertMany(notifications);

        res.status(201).json(assignment);
      });

      blobStream.end(req.file.buffer);
    } else {
      res.status(400).json({ error: "File is required" });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const assignments = await Assignment.find({ courseId });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignments", error });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId);
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignment", error });
  }
};

const submitAssignment = async (req, res) => {
  try {
    let submissionfileUrl = "";

    if (req.file) {
      const blob = bucket.file(
        `submissions/${uuidv4()}-${req.file.originalname}`
      );
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      blobStream.on("error", (error) => {
        res.status(500).json({ error: error.message });
      });

      blobStream.on("finish", async () => {
        submissionfileUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(blob.name)}?alt=media`;

        const { assignmentId, studentId } = req.body;
        const submissionFile = submissionfileUrl;

        const assignment = await Assignment.findById(assignmentId);
        assignment.submissions.push({ studentId, submissionFile });
        await assignment.save();

        res.status(200).json(assignment);
      });

      blobStream.end(req.file.buffer);
    } else {
      res.status(400).json({ error: "File is required" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to submit assignment", error });
  }
};

const getSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId).populate(
      "submissions.studentId",
      "name email"
    );
    res.status(200).json(assignment.submissions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch submissions", error });
  }
};

const assignMarks = async (req, res) => {
  try {
    const { assignmentId, studentId, marksObtained } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    const submission = assignment.submissions.find(
      (sub) => sub.studentId.toString() === studentId
    );

    if (submission) {
      submission.marksObtained = marksObtained;
      await assignment.save();
      res.status(200).json(assignment);
    } else {
      res.status(404).json({ message: "Submission not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to assign marks", error });
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  submitAssignment,
  getSubmissions,
  assignMarks,
};
