const Assignment = require("../models/Assignment");
const Notification = require("../models/Notification");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { getStudentsByCourse } = require("../utils/courseUtils");
const bucket = require("../config/firebase");
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
  // try {
  // const { courseId, title, instructions, deadline, marks } = req.body;
  // const descriptionFile = req.file.path;

  // const assignment = new Assignment({
  //   courseId,
  //   title,
  //   instructions,
  //   descriptionFile,
  //   deadline,
  //   marks,
  // });

  //   await assignment.save();

  // // Create notifications for students
  // const students = await getStudentsByCourse(courseId);
  // const notifications = students.map((student) => ({
  //   userId: student._id,
  //   courseId,
  //   type: "Assignment",
  //   message: `New assignment in course ${courseId}: ${title}`,
  // }));
  // await Notification.insertMany(notifications);

  // res.status(201).json(assignment);
  // } catch (error) {
  //   res.status(500).json({ message: "Failed to create assignment", error });
  // }
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
  // try {
  // const { assignmentId, studentId } = req.body;
  // const submissionFile = req.file.path;

  // const assignment = await Assignment.findById(assignmentId);
  // assignment.submissions.push({ studentId, submissionFile });
  // await assignment.save();

  // res.status(200).json(assignment);
  // } catch (error) {
  //   res.status(500).json({ message: "Failed to submit assignment", error });
  // }
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

// const Assignment = require("../models/Assignment");
// const Notification = require("../models/Notification");
// const multer = require("multer");
// const path = require("path");
// const { getStudentsByCourse } = require("../utils/courseUtils");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "assignments");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const fileTypes = /pdf|doc|docx/;
//   const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = fileTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb("Error: File type not supported");
//   }
// };

// const upload = multer({ storage, fileFilter });

// const createAssignment = async (req, res) => {
//   try {
//     const { courseId, title, instructions, deadline, marks } = req.body;
//     const descriptionFile = req.file.path;

//     const assignment = new Assignment({
//       courseId,
//       title,
//       instructions,
//       descriptionFile,
//       deadline,
//       marks,
//     });

//     await assignment.save();

//     // Create notifications for students
//     const students = await getStudentsByCourse(courseId);
//     const notifications = students.map((student) => ({
//       userId: student._id,
//       courseId,
//       type: "Assignment",
//       message: `New assignment in course ${courseId}: ${title}`,
//     }));
//     await Notification.insertMany(notifications);

//     res.status(201).json(assignment);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to create assignment", error });
//   }
// };

// const getAssignments = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const assignments = await Assignment.find({ courseId });
//     res.status(200).json(assignments);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch assignments", error });
//   }
// };

// const getAssignmentById = async (req, res) => {
//   try {
//     const { assignmentId } = req.params;
//     const assignment = await Assignment.findById(assignmentId);
//     res.status(200).json(assignment);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch assignment", error });
//   }
// };

// const submitAssignment = async (req, res) => {
//   try {
//     const { assignmentId, studentId } = req.body;
//     const submissionFile = req.file.path;

//     const assignment = await Assignment.findById(assignmentId);
//     assignment.submissions.push({ studentId, submissionFile });
//     await assignment.save();

//     res.status(200).json(assignment);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to submit assignment", error });
//   }
// };

// const getSubmissions = async (req, res) => {
//   try {
//     const { assignmentId } = req.params;
//     const assignment = await Assignment.findById(assignmentId).populate(
//       "submissions.studentId",
//       "name email"
//     );
//     res.status(200).json(assignment.submissions);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch submissions", error });
//   }
// };

// const assignMarks = async (req, res) => {
//   try {
//     const { assignmentId, studentId, marksObtained } = req.body;

//     const assignment = await Assignment.findById(assignmentId);
//     const submission = assignment.submissions.find(
//       (sub) => sub.studentId.toString() === studentId
//     );

//     if (submission) {
//       submission.marksObtained = marksObtained;
//       await assignment.save();
//       res.status(200).json(assignment);
//     } else {
//       res.status(404).json({ message: "Submission not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Failed to assign marks", error });
//   }
// };

// module.exports = {
//   upload,
//   createAssignment,
//   getAssignments,
//   getAssignmentById,
//   submitAssignment,
//   getSubmissions,
//   assignMarks,
// };

// const Assignment = require("../models/Assignment");
// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "assignments");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const fileTypes = /pdf|doc|docx/;
//   const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = fileTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb("Error: File type not supported");
//   }
// };

// const upload = multer({ storage, fileFilter });

// const createAssignment = async (req, res) => {
//   try {
//     const { courseId, title, instructions, deadline, marks } = req.body;
//     const descriptionFile = req.file.path;

//     const assignment = new Assignment({
//       courseId,
//       title,
//       instructions,
//       descriptionFile,
//       deadline,
//       marks,
//     });

//     await assignment.save();
//     res.status(201).json(assignment);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to create assignment", error });
//   }
// };

// const getAssignments = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const assignments = await Assignment.find({ courseId });
//     res.status(200).json(assignments);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch assignments", error });
//   }
// };

// const getAssignmentById = async (req, res) => {
//   try {
//     const { assignmentId } = req.params;
//     const assignment = await Assignment.findById(assignmentId);
//     res.status(200).json(assignment);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch assignment", error });
//   }
// };

// const submitAssignment = async (req, res) => {
//   try {
//     const { assignmentId, studentId } = req.body;
//     const submissionFile = req.file.path;

//     const assignment = await Assignment.findById(assignmentId);
//     assignment.submissions.push({ studentId, submissionFile });
//     await assignment.save();

//     res.status(200).json(assignment);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to submit assignment", error });
//   }
// };

// const getSubmissions = async (req, res) => {
//   try {
//     const { assignmentId } = req.params;
//     const assignment = await Assignment.findById(assignmentId).populate(
//       "submissions.studentId",
//       "name email"
//     );
//     res.status(200).json(assignment.submissions);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch submissions", error });
//   }
// };

// const assignMarks = async (req, res) => {
//   try {
//     const { assignmentId, studentId, marksObtained } = req.body;

//     const assignment = await Assignment.findById(assignmentId);
//     const submission = assignment.submissions.find(
//       (sub) => sub.studentId.toString() === studentId
//     );

//     if (submission) {
//       submission.marksObtained = marksObtained;
//       await assignment.save();
//       res.status(200).json(assignment);
//     } else {
//       res.status(404).json({ message: "Submission not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Failed to assign marks", error });
//   }
// };

// module.exports = {
//   upload,
//   createAssignment,
//   getAssignments,
//   getAssignmentById,
//   submitAssignment,
//   getSubmissions,
//   assignMarks,
// };

// const Assignment = require("../models/Assignment");
// const Submission = require("../models/Submission");
// const path = require("path");
// const fs = require("fs");

// exports.createAssignment = async (req, res) => {
//   const { title, instructions, deadline, course } = req.body;
//   const descriptionFile = req.file.path;

//   try {
//     const assignment = await Assignment.create({
//       title,
//       instructions,
//       descriptionFile,
//       deadline,
//       course,
//       createdBy: req.user._id,
//     });
//     res.status(201).json(assignment);
//   } catch (error) {
//     console.error("Error creating assignment:", error);
//     res.status(400).json({ message: "Invalid assignment data" });
//   }
// };

// exports.getAssignments = async (req, res) => {
//   try {
//     const assignments = await Assignment.find({ course: req.params.courseId });
//     res.status(200).json(assignments);
//   } catch (error) {
//     console.error("Error fetching assignments:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getAssignment = async (req, res) => {
//   try {
//     const assignment = await Assignment.findById(req.params.assignmentId);
//     res.status(200).json(assignment);
//   } catch (error) {
//     console.error("Error fetching assignment:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.submitAssignment = async (req, res) => {
//   try {
//     const { courseId, assignmentId } = req.params;
//     const studentId = req.user._id;
//     const submissionFile = req.file.path;

//     const submission = await Submission.create({
//       course: courseId,
//       assignment: assignmentId,
//       student: studentId,
//       submissionFile,
//       submittedAt: new Date(),
//     });

//     await Assignment.findByIdAndUpdate(assignmentId, {
//       $push: { submissions: submission._id },
//     });

//     res
//       .status(200)
//       .json({ message: "Assignment submitted successfully", submission });
//   } catch (error) {
//     console.error("Error submitting assignment:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getSubmissions = async (req, res) => {
//   try {
//     const { assignmentId } = req.params;
//     const submissions = await Submission.find({
//       assignment: assignmentId,
//     }).populate("student", "name email");
//     res.status(200).json(submissions);
//   } catch (error) {
//     console.error("Error fetching submissions:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.downloadFile = (req, res) => {
//   const filePath = path.join(__dirname, "../uploads", req.params.filename);
//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       console.error("File not found:", err);
//       res.status(404).send("File wasn't available on site");
//     } else {
//       res.download(filePath);
//     }
//   });
// };

// const Assignment = require("../models/Assignment");
// const Submission = require("../models/Submission");
// const path = require("path");
// const fs = require("fs");

// exports.createAssignment = async (req, res) => {
//   const { title, instructions, deadline, course } = req.body;
//   const descriptionFile = req.file.path;

//   try {
//     const assignment = await Assignment.create({
//       title,
//       instructions,
//       descriptionFile,
//       deadline,
//       course,
//       createdBy: req.user._id,
//     });
//     res.status(201).json(assignment);
//   } catch (error) {
//     console.error("Error creating assignment:", error);
//     res.status(400).json({ message: "Invalid assignment data" });
//   }
// };

// exports.getAssignments = async (req, res) => {
//   try {
//     const assignments = await Assignment.find({ course: req.params.courseId });
//     res.status(200).json(assignments);
//   } catch (error) {
//     console.error("Error fetching assignments:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getAssignment = async (req, res) => {
//   try {
//     const assignment = await Assignment.findById(req.params.assignmentId);
//     res.status(200).json(assignment);
//   } catch (error) {
//     console.error("Error fetching assignment:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.downloadAssignmentDescriptionFile = async (req, res) => {
//   try {
//     const assignment = await Assignment.findOne({
//       descriptionFile: req.params.file,
//     });
//     if (!assignment) {
//       return res.status(404).json({ message: "File not found" });
//     }
//     const filePath = path.join(__dirname, "..", "uploads", req.params.file);
//     res.download(filePath);
//   } catch (error) {
//     console.error("Error downloading file:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // exports.getAssignment = async (req, res) => {
// //   try {
// //     const assignment = await Assignment.findById(req.params.id).populate(
// //       "submissions"
// //     );
// //     if (!assignment) {
// //       return res.status(404).json({ message: "Assignment not found" });
// //     }
// //     res.json(assignment);
// //   } catch (error) {
// //     console.error("Error fetching assignment:", error);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };

// exports.submitAssignment = async (req, res) => {
//   try {
//     const { courseId, assignmentId } = req.params;
//     const studentId = req.user._id;
//     const submissionFile = req.file.path;

//     const submission = await Submission.create({
//       course: courseId,
//       assignment: assignmentId,
//       student: studentId,
//       submissionFile,
//       submittedAt: new Date(),
//     });

//     await Assignment.findByIdAndUpdate(assignmentId, {
//       $push: { submissions: submission._id },
//     });

//     res
//       .status(200)
//       .json({ message: "Assignment submitted successfully", submission });
//   } catch (error) {
//     console.error("Error submitting assignment:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getSubmissions = async (req, res) => {
//   try {
//     const { assignmentId } = req.params;
//     const submissions = await Submission.find({
//       assignment: assignmentId,
//     }).populate("student", "name email");
//     res.status(200).json(submissions);
//   } catch (error) {
//     console.error("Error fetching submissions:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getSubmissions = async (req, res) => {
//   try {
//     const submissions = await Submission.find({ assignment: req.params.id });
//     res.json(submissions);
//   } catch (error) {
//     console.error("Error fetching submissions:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const Assignment = require("../models/Assignment");
// const Submission = require("../models/Submission"); // Assuming you have a separate Submission model

// exports.createAssignment = async (req, res) => {
//   const { title, instructions, deadline, course } = req.body;
//   const descriptionFile = req.file.path;

//   try {
//     const assignment = await Assignment.create({
//       title,
//       instructions,
//       descriptionFile,
//       deadline,
//       course,
//       createdBy: req.user._id,
//     });
//     res.status(201).json(assignment);
//   } catch (error) {
//     console.error("Error creating assignment:", error);
//     res.status(400).json({ message: "Invalid assignment data" });
//   }
// };

// exports.getAssignments = async (req, res) => {
//   try {
//     const assignments = await Assignment.find({ course: req.params.courseId });
//     res.status(200).json(assignments);
//   } catch (error) {
//     console.error("Error fetching assignments:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getAssignment = async (req, res) => {
//   try {
//     const assignment = await Assignment.findById(req.params.assignmentId);
//     res.status(200).json(assignment);
//   } catch (error) {
//     console.error("Error fetching assignment:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.submitAssignment = async (req, res) => {
//   try {
//     const { courseId, assignmentId } = req.params;
//     const studentId = req.user._id;
//     const submissionFile = req.file.path;

//     const submission = await Submission.create({
//       course: courseId,
//       assignment: assignmentId,
//       student: studentId,
//       submissionFile,
//       submittedAt: new Date(),
//     });

//     res
//       .status(200)
//       .json({ message: "Assignment submitted successfully", submission });
//   } catch (error) {
//     console.error("Error submitting assignment:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getSubmissions = async (req, res) => {
//   try {
//     const { assignmentId } = req.params;
//     const submissions = await Submission.find({
//       assignment: assignmentId,
//     }).populate("student", "name email");
//     res.status(200).json(submissions);
//   } catch (error) {
//     console.error("Error fetching submissions:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const Assignment = require("../models/Assignment");

// exports.createAssignment = async (req, res) => {
//   const { title, instructions, deadline, course } = req.body;
//   const descriptionFile = req.file.path;

//   try {
//     const assignment = await Assignment.create({
//       title,
//       instructions,
//       descriptionFile,
//       deadline,
//       course,
//       createdBy: req.user._id,
//     });
//     res.status(201).json(assignment);
//   } catch (error) {
//     console.error("Error creating assignment:", error);
//     res.status(400).json({ message: "Invalid assignment data" });
//   }
// };

// exports.getAssignments = async (req, res) => {
//   try {
//     const assignments = await Assignment.find({ course: req.params.courseId });
//     res.json(assignments);
//   } catch (error) {
//     console.error("Error fetching assignments:", error);
//     res.status(400).json({ message: "Error fetching assignments" });
//   }
// };

// exports.getAssignment = async (req, res) => {
//   try {
//     const assignment = await Assignment.findById(req.params.id);

//     if (!assignment || assignment.course.toString() !== req.params.courseId) {
//       return res.status(404).json({ message: "Assignment not found" });
//     }

//     res.json(assignment);
//   } catch (error) {
//     console.error("Error fetching assignment:", error);
//     res.status(400).json({ message: "Error fetching assignment" });
//   }
// };

// exports.submitAssignment = async (req, res) => {
//   const { submissionFile } = req.body;

//   try {
//     const assignment = await Assignment.findById(req.params.id);

//     if (!assignment) {
//       return res.status(404).json({ message: "Assignment not found" });
//     }

//     assignment.submissions.push({
//       student: req.user._id,
//       submissionFile,
//     });

//     await assignment.save();
//     res.status(201).json({ message: "Assignment submitted successfully" });
//   } catch (error) {
//     console.error("Error submitting assignment:", error);
//     res.status(400).json({ message: "Error submitting assignment" });
//   }
// };

// const Assignment = require("../models/Assignment");

// exports.createAssignment = async (req, res) => {
//   const { title, instructions, deadline, course } = req.body;
//   const descriptionFile = req.file.path;

//   try {
//     const assignment = await Assignment.create({
//       title,
//       instructions,
//       descriptionFile,
//       deadline,
//       course,
//       createdBy: req.user._id,
//     });
//     res.status(201).json(assignment);
//   } catch (error) {
//     console.error("Error creating assignment:", error);
//     res.status(400).json({ message: "Invalid assignment data" });
//   }
// };

// exports.getAssignments = async (req, res) => {
//   try {
//     const assignments = await Assignment.find({ course: req.params.courseId });
//     res.json(assignments);
//   } catch (error) {
//     console.error("Error fetching assignments:", error);
//     res.status(400).json({ message: "Error fetching assignments" });
//   }
// };

// exports.getAssignment = async (req, res) => {
//   try {
//     const assignment = await Assignment.findById(req.params.id);

//     if (assignment && assignment.course.toString() === req.params.courseId) {
//       res.json(assignment);
//     } else {
//       res.status(404).json({ message: "Assignment not found" });
//     }
//   } catch (error) {
//     console.error("Error fetching assignment:", error);
//     res.status(400).json({ message: "Error fetching assignment" });
//   }
// };

// exports.submitAssignment = async (req, res) => {
//   const { submissionFile } = req.body;

//   try {
//     const assignment = await Assignment.findById(req.params.id);

//     if (assignment) {
//       assignment.submissions.push({
//         student: req.user._id,
//         submissionFile,
//       });

//       await assignment.save();
//       res.status(201).json({ message: "Assignment submitted successfully" });
//     } else {
//       res.status(404).json({ message: "Assignment not found" });
//     }
//   } catch (error) {
//     console.error("Error submitting assignment:", error);
//     res.status(400).json({ message: "Error submitting assignment" });
//   }
// };

// assignmentController.js
// const Assignment = require("../models/Assignment");

// exports.getAssignments = async (req, res) => {
//   const courseId = req.query.courseId; // Retrieve courseId from query parameter

//   try {
//     const assignments = await Assignment.find({ courseId }); // Filter assignments by courseId
//     res.json(assignments);
//   } catch (error) {
//     console.error("Error fetching assignments", error);
//     res.status(404).json({ message: "Assignments not found" });
//   }
// };

// ------------------------------------------------------
// const Assignment = require("../models/Assignment");

// exports.createAssignment = async (req, res) => {
//   const { title, instructions, descriptionFile, deadline, course } = req.body;

//   try {
//     const assignment = await Assignment.create({
//       title,
//       instructions,
//       descriptionFile,
//       deadline,
//       course,
//       createdBy: req.user._id,
//     });
//     res.status(201).json(assignment);
//   } catch (error) {
//     console.error("Error creating assignment:", error);
//     res.status(400).json({ message: "Invalid assignment data" });
//   }
// };

// exports.getAssignments = async (req, res) => {
//   try {
//     const assignments = await Assignment.find({ course: req.params.courseId });
//     res.json(assignments);
//   } catch (error) {
//     console.error("Error fetching assignments:", error);
//     res.status(400).json({ message: "Error fetching assignments" });
//   }
// };

// exports.getAssignment = async (req, res) => {
//   try {
//     const assignment = await Assignment.findById(req.params.id);

//     if (assignment && assignment.course.toString() === req.params.courseId) {
//       res.json(assignment);
//     } else {
//       res.status(404).json({ message: "Assignment not found" });
//     }
//   } catch (error) {
//     console.error("Error fetching assignment:", error);
//     res.status(400).json({ message: "Error fetching assignment" });
//   }
// };

// exports.submitAssignment = async (req, res) => {
//   const { submissionFile } = req.body;

//   try {
//     const assignment = await Assignment.findById(req.params.id);

//     if (assignment) {
//       assignment.submissions.push({
//         student: req.user._id,
//         submissionFile,
//       });

//       await assignment.save();
//       res.status(201).json({ message: "Assignment submitted successfully" });
//     } else {
//       res.status(404).json({ message: "Assignment not found" });
//     }
//   } catch (error) {
//     console.error("Error submitting assignment:", error);
//     res.status(400).json({ message: "Error submitting assignment" });
//   }
// };
// -------------------------------------------------------------
