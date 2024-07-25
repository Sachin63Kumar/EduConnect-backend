const Notification = require("../models/Notification");

const createNotification = async (userId, message, type) => {
  try {
    const notification = new Notification({
      userId,
      message,
      type,
    });
    await notification.save();
  } catch (error) {
    console.error("Failed to create notification", error);
  }
};

module.exports = createNotification;
