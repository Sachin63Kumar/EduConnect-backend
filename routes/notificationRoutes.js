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
// Get notifications for a specific user
router.get("/:userId", async (req, res) => {
  //   try {
  //     const notifications = await Notification.find({
  //       userId: req.params.userId,
  //     });
  //     res.json(notifications);
  //   } catch (error) {
  //     console.error("Error fetching notifications:", error);
  //     res.status(500).json({ message: "Internal Server Error" });
  //   }
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

// const express = require("express");
// const router = express.Router();
// const notificationController = require("../controllers/notificationController");
// // const auth = require("../middleware/auth");

// // Route to get notifications for a user
// router.get("/", notificationController.getNotifications);

// // Route to mark a notification as read
// router.put("/:id/read", notificationController.markAsRead);

// // Route to delete a notification
// router.delete("/:id", notificationController.deleteNotification);

// module.exports = router;
