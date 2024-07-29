const express = require("express");
const router = express.Router();
// const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const bucket = require("../config/firebase");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB file size limit
});

const {
  addResource,
  getResources,
} = require("../controllers/resourceController");

router.post("/add", upload.single("file"), addResource);
router.get("/:courseId", getResources);

module.exports = router;

// const express = require("express");
// const {
//   addResource,
//   getResources,
// } = require("../controllers/resourceController");
// const multer = require("multer");
// const path = require("path");

// const router = express.Router();

// // Import multer configuration
// const resourceUpload = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "resources/");
//     },
//     filename: function (req, file, cb) {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     const filetypes = /pdf|doc|docx|txt/;
//     const mimetype = filetypes.test(file.mimetype);
//     const extname = filetypes.test(
//       path.extname(file.originalname).toLowerCase()
//     );

//     if (mimetype && extname) {
//       return cb(null, true);
//     }
//     cb(
//       new Error(
//         "File upload only supports the following filetypes - " + filetypes
//       )
//     );
//   },
// });

// router.post("/add", resourceUpload.single("file"), addResource);
// router.get("/:courseId", getResources);

// module.exports = router;
