const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const studentRoutes = require("./routes/studentRoutes");
const userRoutes = require("./routes/userRoutes");
const quizRoutes = require("./routes/quizRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const timeTableRoutes = require("./routes/timeTableRoutes");
const facultyDashboardRoutes = require("./routes/facultydashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/faculty-dashboard", facultyDashboardRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/timetables", timeTableRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Connection error", error.message);
  });

app.get("/", (req, res) => {
  res.send("API is running...");
});

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const authRoutes = require("./routes/authRoutes");
// const courseRoutes = require("./routes/courseRoutes");
// const assignmentRoutes = require("./routes/assignmentRoutes");
// const studentRoutes = require("./routes/studentRoutes");
// const userRoutes = require("./routes/userRoutes");
// const quizRoutes = require("./routes/quizRoutes");
// const resourceRoutes = require("./routes/resourceRoutes");
// const announcementRoutes = require("./routes/announcementRoutes");
// const timeTableRoutes = require("./routes/timeTableRoutes");
// const facultyDashboardRoutes = require("./routes/facultydashboardRoutes");
// const notificationRoutes = require("./routes/notificationRoutes");
// const multer = require("multer");
// const path = require("path");

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/resources", express.static(path.join(__dirname, "resources")));
// app.use("/assignments", express.static(path.join(__dirname, "assignments")));

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

// // Configure Multer for resource uploads
// const resourceStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "resources/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const resourceFileFilter = (req, file, cb) => {
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

// const resourceUpload = multer({
//   storage: resourceStorage,
//   fileFilter: resourceFileFilter,
// });

// // Configure Multer for assignment uploads
// const assignmentStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "assignments/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const assignmentFileFilter = (req, file, cb) => {
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

// const assignmentUpload = multer({
//   storage: assignmentStorage,
//   fileFilter: assignmentFileFilter,
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/faculty-dashboard", facultyDashboardRoutes);
// app.use("/api/courses", courseRoutes);
// app.use("/api/assignments", assignmentRoutes);
// app.use("/api/students", studentRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/quizzes", quizRoutes);
// app.use("/api/resources", resourceRoutes);
// app.use("/api/announcements", announcementRoutes);
// app.use("/api/timetables", timeTableRoutes);
// app.use("/api/notifications", notificationRoutes);

// const PORT = process.env.PORT || 5000;

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((error) => {
//     console.error("Connection error", error.message);
//   });

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });
