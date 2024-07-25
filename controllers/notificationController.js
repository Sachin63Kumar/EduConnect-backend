const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort(
      { createdAt: -1 }
    );
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const Notification = require("../models/Notification");

// // Get all notifications for a user
// exports.getNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.find({ userId: req.user.id }).sort(
//       { createdAt: -1 }
//     );
//     res.status(200).json(notifications);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch notifications", error });
//   }
// };

// // Mark a notification as read
// exports.markAsRead = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const notification = await Notification.findByIdAndUpdate(
//       id,
//       { read: true },
//       { new: true }
//     );
//     if (!notification) {
//       return res.status(404).json({ message: "Notification not found" });
//     }
//     res.status(200).json(notification);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to mark notification as read", error });
//   }
// };

// // Delete a notification
// exports.deleteNotification = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const notification = await Notification.findByIdAndDelete(id);
//     if (!notification) {
//       return res.status(404).json({ message: "Notification not found" });
//     }
//     res.status(200).json({ message: "Notification deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete notification", error });
//   }
// };
