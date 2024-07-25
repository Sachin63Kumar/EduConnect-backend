const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getAllStudents } = require("../controllers/userController");

const router = express.Router();

router.route("/students").get(protect, getAllStudents);

module.exports = router;
