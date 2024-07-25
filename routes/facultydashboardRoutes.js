const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();
const {
  getFacultyInformation,
} = require("../controllers/facultyDashboardController");

router.route("/:userId").get(protect, getFacultyInformation);

module.exports = router;
