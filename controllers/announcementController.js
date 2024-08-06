const Announcement = require("../models/Announcement");
const Notification = require("../models/Notification");
const { getStudentsByCourse } = require("../utils/courseUtils");

exports.createAnnouncement = async (req, res) => {
  const { courseId, content } = req.body;
  const facultyId = req.user.id;

  try {
    const announcement = await Announcement.create({
      courseId,
      facultyId,
      content,
    });

    // Create notifications for students
    const students = await getStudentsByCourse(courseId);
    const notifications = students.map((student) => ({
      userId: student._id,
      courseId,
      type: "Announcement",
      message: `New announcement in course ${courseId}: ${content}`,
    }));
    await Notification.insertMany(notifications);

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnnouncements = async (req, res) => {
  const { courseId } = req.params;

  try {
    const announcements = await Announcement.find({ courseId }).sort({
      createdAt: -1,
    });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const announcement = await Announcement.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.status(200).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.status(200).json({ message: "Announcement deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
