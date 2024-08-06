const express = require("express");
const {
  createTimeTable,
  getTimeTable,
  updateTimeTable,
  deleteTimeTable,
} = require("../controllers/timeTableController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", protect, createTimeTable);
router.get("/", protect, getTimeTable);
router.put("/update", protect, updateTimeTable);
router.delete("/delete", protect, deleteTimeTable);

module.exports = router;
