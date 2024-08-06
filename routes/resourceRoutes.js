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
