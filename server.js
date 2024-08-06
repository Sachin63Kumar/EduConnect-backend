const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimiter = require("./middlewares/rateLimit");
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
app.use(rateLimiter);

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
