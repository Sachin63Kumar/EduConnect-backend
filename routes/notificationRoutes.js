const express = require("express");
const {
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");
const Notification = require("../models/Notification");
const Course = require("../models/Course");

const router = express.Router();

router.get("/", getNotifications);
router.put("/:id/read", markAsRead);
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    const notificationsWithCourseName = await Promise.all(
      notifications.map(async (notification) => {
        const course = await Course.findById(notification.courseId);
        return {
          ...notification._doc,
          courseName: course ? course.courseName : "Unknown Course",
        };
      })
    );
    res.json(notificationsWithCourseName);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
