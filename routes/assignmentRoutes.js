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
router.get("/assignment/:assignmentId", getAssignmentById); // Add this line
router.post("/submit", upload.single("file"), submitAssignment);
router.get("/submissions/:assignmentId", getSubmissions);
router.post("/assign-marks", assignMarks);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const {
//   upload,
//   createAssignment,
//   getAssignments,
//   getAssignmentById,
//   submitAssignment,
//   getSubmissions,
//   assignMarks,
// } = require("../controllers/assignmentController");

// router.post("/add", upload.single("file"), createAssignment);
// router.get("/:courseId", getAssignments);
// router.get("/assignment/:assignmentId", getAssignmentById); // Add this line
// router.post("/submit", upload.single("file"), submitAssignment);
// router.get("/submissions/:assignmentId", getSubmissions);
// router.post("/assign-marks", assignMarks);

// module.exports = router;

// const express = require("express");
// const { protect } = require("../middlewares/authMiddleware");
// const {
//   createAssignment,
//   getAssignments,
//   getAssignment,
//   submitAssignment,
//   getSubmissions,
//   downloadFile,
// } = require("../controllers/assignmentController");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const router = express.Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const filetypes = /pdf|doc|docx|txt/;
//   const mimetype = filetypes.test(file.mimetype);
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

//   if (mimetype && extname) {
//     return cb(null, true);
//   }
//   cb(
//     new Error(
//       "File upload only supports the following filetypes - " + filetypes
//     )
//   );
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// });

// router
//   .route("/:courseId")
//   .post(protect, upload.single("descriptionFile"), createAssignment)
//   .get(protect, getAssignments);

// router
//   .route("/:courseId/:assignmentId")
//   .get(protect, getAssignment)
//   .post(protect, upload.single("submissionFile"), submitAssignment);

// router.route("/:assignmentId/submissions").get(protect, getSubmissions);

// Route to handle file download
// router.get("/download/:filename", downloadFile);
// router.get("/download/:filename", (req, res) => {
//   const filename = req.params.filename;
//   const filePath = path.join(__dirname, "uploads", filename);

//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       console.error("File not found:", filePath);
//       return res.status(404).json({ message: "File not found" });
//     }

//     res.download(filePath);
//   });
// });

// ---------------------------------------------------------
// router.get("/download/:filename", (req, res) => {
//   const filename = req.params.filename;
//   const decodedFilename = decodeURIComponent(filename);
//   const filePath = path.join(__dirname, "uploads", decodedFilename);

//   // Log to verify the path
//   console.log(`Decoded file path: ${filePath}`);

//   fs.stat(filePath, (err, stats) => {
//     if (err) {
//       if (err.code === "ENOENT") {
//         // file does not exist
//         res.status(404).send("File not found");
//       } else {
//         // other errors, e.g. maybe we don't have enough permission
//         res.status(500).send(err.message);
//       }
//     } else {
//       res.download(filePath);
//     }
//   });
// });

// module.exports = router;

// -------------------------------------------------------

// const express = require("express");
// const { protect } = require("../middlewares/authMiddleware");
// const {
//   createAssignment,
//   getAssignments,
//   getAssignment,
//   submitAssignment,
//   getSubmissions,
//   // downloadAssignmentDescriptionFile,
// } = require("../controllers/assignmentController");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// router
//   .route("/:courseId")
//   .post(protect, upload.single("descriptionFile"), createAssignment)
//   .get(protect, getAssignments);

// router
//   .route("/:courseId/:assignmentId")
//   .get(protect, getAssignment)
//   .post(protect, upload.single("submissionFile"), submitAssignment);

// // router.route("/download/:file").get(protect, downloadAssignmentDescriptionFile);
// router.route("/:assignmentId/submissions").get(protect, getSubmissions);

// // Route to handle file download
// router.get("/download/:filename", (req, res) => {
//   const filePath = path.join(__dirname, "../uploads", req.params.filename);
//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       console.error("File not found:", err);
//       res.status(404).send("File wasn't available on site");
//     } else {
//       res.download(filePath);
//     }
//   });
// });

// module.exports = router;

// const express = require("express");
// const { protect } = require("../middlewares/authMiddleware");
// const {
//   createAssignment,
//   getAssignments,
//   getAssignment,
//   submitAssignment,
//   getSubmissions,
// } = require("../controllers/assignmentController");
// const multer = require("multer");

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// router
//   .route("/:courseId")
//   .post(protect, upload.single("descriptionFile"), createAssignment)
//   .get(protect, getAssignments);

// router
//   .route("/:courseId/:assignmentId")
//   .get(protect, getAssignment)
//   .post(protect, upload.single("submissionFile"), submitAssignment);

// router.route("/:assignmentId/submissions").get(protect, getSubmissions);

// module.exports = router;

// const express = require("express");
// const { protect } = require("../middlewares/authMiddleware");
// const {
//   createAssignment,
//   getAssignments,
//   getAssignment,
//   submitAssignment,
// } = require("../controllers/assignmentController");
// const multer = require("multer");

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// router
//   .route("/:courseId")
//   .post(protect, upload.single("descriptionFile"), createAssignment)
//   .get(protect, getAssignments);

// router
//   .route("/:courseId/:assignmentId")
//   .get(protect, getAssignment)
//   .post(protect, upload.single("submissionFile"), submitAssignment);

// module.exports = router;

// const express = require("express");
// const { protect } = require("../middlewares/authMiddleware");
// const {
//   createAssignment,
//   getAssignments,
//   getAssignment,
//   submitAssignment,
// } = require("../controllers/assignmentController");
// const multer = require("multer");

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// router
//   .route("/:courseId")
//   .post(protect, upload.single("descriptionFile"), createAssignment)
//   .get(protect, getAssignments);

// router
//   .route("/:courseId/:id")
//   .get(protect, getAssignment)
//   .post(protect, submitAssignment);

// module.exports = router;

// const express = require("express");
// const { protect } = require("../middlewares/authMiddleware");
// const {
//   createAssignment,
//   getAssignments,
//   getAssignment,
//   submitAssignment,
// } = require("../controllers/assignmentController");
// const multer = require("multer");

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// router
//   .route("/:courseId")
//   .post(protect, upload.single("descriptionFile"), createAssignment)
//   .get(protect, getAssignments); // Updated this line

// router
//   .route("/:courseId/assignment/:id")
//   .get(protect, getAssignment)
//   .post(protect, submitAssignment);

// module.exports = router;

// -----------------------------------------------------
// const express = require("express");
// const { protect } = require("../middlewares/authMiddleware");
// const {
//   createAssignment,
//   getAssignments,
//   getAssignment,
//   submitAssignment,
// } = require("../controllers/assignmentController");

// const router = express.Router();

// router
//   .route("/:courseId")
//   .post(protect, createAssignment)
//   .get(protect, getAssignments);

// router
//   .route("/:courseId/:id")
//   .get(protect, getAssignment)
//   .post(protect, submitAssignment);

// module.exports = router;
// -----------------------------------------
