const Resource = require("../models/Resource");
const Notification = require("../models/Notification");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { getStudentsByCourse } = require("../utils/courseUtils");
const bucket = require("../config/firebase");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const addResource = async (req, res) => {
  try {
    let resourcefileUrl = "";

    if (req.file) {
      const blob = bucket.file(
        `resources/${uuidv4()}-${req.file.originalname}`
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
        resourcefileUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(blob.name)}?alt=media`;

        const { courseId, name, description } = req.body;
        const path = resourcefileUrl;

        const newResource = new Resource({
          courseId,
          name,
          description,
          path,
          uploadedAt: new Date(),
        });

        await newResource.save();

        // Create notifications for students
        const students = await getStudentsByCourse(courseId);
        const notifications = students.map((student) => ({
          userId: student._id,
          courseId,
          type: "Resource",
          message: `New resource added in course ${courseId}: ${name}`,
        }));
        await Notification.insertMany(notifications);

        res.status(201).json(newResource);
      });

      blobStream.end(req.file.buffer);
    } else {
      res.status(400).json({ error: "File is required" });
    }
  } catch (error) {
    console.error("Error in addResource:", error); // Log the error details
    res
      .status(500)
      .json({ message: "Failed to upload resource", error: error.message });
  }
};

const getResources = async (req, res) => {
  try {
    const { courseId } = req.params;
    const resources = await Resource.find({ courseId });
    res.status(200).json(resources);
  } catch (error) {
    console.error("Error in getResources:", error); // Log the error details
    res
      .status(500)
      .json({ message: "Failed to fetch resources", error: error.message });
  }
};

module.exports = { addResource, getResources };

// const Resource = require("../models/Resource");

// const addResource = async (req, res) => {
//   try {
//     const { courseId, name, description } = req.body;
//     const { filename, path } = req.file;

//     const newResource = new Resource({
//       courseId,
//       name,
//       description,
//       filename,
//       path,
//       uploadedAt: new Date(),
//     });

//     await newResource.save();
//     res.status(201).json(newResource);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to upload resource" });
//   }
// };

// const getResources = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const resources = await Resource.find({ courseId });
//     res.status(200).json(resources);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch resources" });
//   }
// };

// module.exports = { addResource, getResources };

// const Resource = require("../models/Resource");

// const addResource = async (req, res) => {
//   try {
//     const { courseId } = req.body;
//     const { filename, path } = req.file;

//     const newResource = new Resource({
//       courseId,
//       filename,
//       path,
//       uploadedAt: new Date(),
//     });

//     await newResource.save();
//     res.status(201).json(newResource);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to upload resource" });
//   }
// };

// const getResources = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const resources = await Resource.find({ courseId });
//     res.status(200).json(resources);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch resources" });
//   }
// };

// module.exports = { addResource, getResources };
// const Resource = require("../models/Resource");

// const addResource = async (req, res) => {
//   try {
//     const { courseId } = req.body;
//     const { filename, path } = req.file;

//     const newResource = new Resource({
//       courseId,
//       filename,
//       path,
//       uploadedAt: new Date(),
//     });

//     await newResource.save();
//     res.status(201).json(newResource);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to upload resource" });
//   }
// };

// const getResources = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const resources = await Resource.find({ courseId });
//     res.status(200).json(resources);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch resources" });
//   }
// };

// module.exports = { addResource, getResources };

// const Resource = require("../models/Resource");

// // Controller to add a new resource
// exports.addResource = async (req, res) => {
//   try {
//     const { courseId } = req.body;
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const resource = new Resource({
//       courseId,
//       filename: file.filename,
//       originalname: file.originalname,
//       path: file.path,
//     });

//     await resource.save();

//     res
//       .status(201)
//       .json({ message: "Resource uploaded successfully", resource });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to upload resource", error });
//   }
// };

// // Controller to get all resources for a specific course
// exports.getResources = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const resources = await Resource.find({ courseId });

//     res.status(200).json(resources);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch resources", error });
//   }
// };
