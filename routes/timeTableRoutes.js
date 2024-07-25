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

// const express = require("express");
// const router = express.Router();
// // const auth = require("../middleware/auth");
// const {
//   createTimeTable,
//   getTimeTableByFacultyId,
//   deleteTimeTableById,
//   updateTimeTableById,
// } = require("../controllers/timeTables");

// // Create Time Table
// router.post("/", async (req, res) => {
//   const { facultyId, schedule } = req.body;

//   try {
//     const newTimeTable = await createTimeTable(facultyId, schedule);
//     res.status(201).json(newTimeTable);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // Get Time Table by Faculty ID
// router.get("/", async (req, res) => {
//   const facultyId = req.user.id; // Assuming faculty ID is stored in req.user.id after authentication

//   try {
//     const timeTable = await getTimeTableByFacultyId(facultyId);
//     res.json(timeTable);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // Delete Time Table by ID
// router.delete("/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await deleteTimeTableById(id);
//     res.json(result);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // Update Time Table by ID
// router.put("/:id", async (req, res) => {
//   const { id } = req.params;
//   const { schedule } = req.body;

//   try {
//     const updatedTimeTable = await updateTimeTableById(id, schedule);
//     res.json(updatedTimeTable);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// module.exports = router;

// // routes/timeTableRoutes.js

// const express = require("express");
// const {
//   createTimeTable,
//   getTimeTableByFaculty,
//   updateTimeTable,
//   deleteTimeTable,
// } = require("../controllers/timeTableController");
// const { protect } = require("../middlewares/authMiddleware");
// const router = express.Router();

// router.post("/", protect, createTimeTable);
// router.get("/:facultyId", protect, getTimeTableByFaculty);
// router.put("/:id", protect, updateTimeTable);
// router.delete("/:id", protect, deleteTimeTable);

// module.exports = router;
