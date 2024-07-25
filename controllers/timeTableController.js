const TimeTable = require("../models/TimeTable");

const getTimeTable = async (req, res) => {
  try {
    const timeTable = await TimeTable.findOne({ user: req.user._id });
    if (timeTable) {
      res.json(timeTable);
    } else {
      res.status(404).json({ message: "Time table not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTimeTable = async (req, res) => {
  try {
    const timeTable = new TimeTable({
      user: req.user._id,
      schedule: req.body.schedule,
    });
    const createdTimeTable = await timeTable.save();
    res.status(201).json(createdTimeTable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTimeTable = async (req, res) => {
  try {
    const timeTable = await TimeTable.findOne({ user: req.user._id });
    if (timeTable) {
      timeTable.schedule = req.body.schedule;
      const updatedTimeTable = await timeTable.save();
      res.json(updatedTimeTable);
    } else {
      res.status(404).json({ message: "Time table not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTimeTable = async (req, res) => {
  try {
    const timeTable = await TimeTable.findOne({ user: req.user._id });
    if (timeTable) {
      await timeTable.remove();
      res.json({ message: "Time table removed" });
    } else {
      res.status(404).json({ message: "Time table not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTimeTable,
  createTimeTable,
  updateTimeTable,
  deleteTimeTable,
};

// const TimeTable = require("../models/TimeTable");

// exports.createTimeTable = async (req, res) => {
//   try {
//     const { schedule } = req.body;
//     const facultyId = req.user._id;

//     const newTimeTable = new TimeTable({
//       facultyId,
//       schedule,
//     });

//     await newTimeTable.save();

//     res
//       .status(201)
//       .json({ message: "Time Table Created Successfully", newTimeTable });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.getTimeTable = async (req, res) => {
//   try {
//     const facultyId = req.user._id;
//     const timeTable = await TimeTable.findOne({ facultyId });

//     if (!timeTable) {
//       return res.status(404).json({ message: "Time Table not found" });
//     }

//     res.status(200).json(timeTable);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.updateTimeTable = async (req, res) => {
//   try {
//     const { schedule } = req.body;
//     const facultyId = req.user._id;

//     const updatedTimeTable = await TimeTable.findOneAndUpdate(
//       { facultyId },
//       { schedule },
//       { new: true }
//     );

//     if (!updatedTimeTable) {
//       return res.status(404).json({ message: "Time Table not found" });
//     }

//     res
//       .status(200)
//       .json({ message: "Time Table Updated Successfully", updatedTimeTable });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.deleteTimeTable = async (req, res) => {
//   try {
//     const facultyId = req.user._id;

//     const deletedTimeTable = await TimeTable.findOneAndDelete({ facultyId });

//     if (!deletedTimeTable) {
//       return res.status(404).json({ message: "Time Table not found" });
//     }

//     res.status(200).json({ message: "Time Table Deleted Successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const TimeTable = require("../models/TimeTable");

// // Create Time Table
// const createTimeTable = async (facultyId, schedule) => {
//   try {
//     const newTimeTable = new TimeTable({
//       facultyId,
//       schedule,
//     });

//     await newTimeTable.save();
//     return newTimeTable;
//   } catch (err) {
//     console.error("Error creating time table:", err.message);
//     throw new Error("Failed to create time table");
//   }
// };

// // Get Time Table by Faculty ID
// const getTimeTableByFacultyId = async (facultyId) => {
//   try {
//     const timeTable = await TimeTable.findOne({ facultyId });
//     if (!timeTable) {
//       throw new Error("Time table not found");
//     }
//     return timeTable;
//   } catch (err) {
//     console.error("Error fetching time table:", err.message);
//     throw new Error("Failed to fetch time table");
//   }
// };

// // Delete Time Table by ID
// const deleteTimeTableById = async (id) => {
//   try {
//     const timeTable = await TimeTable.findById(id);
//     if (!timeTable) {
//       throw new Error("Time table not found");
//     }

//     await TimeTable.findByIdAndRemove(id);
//     return { msg: "Time table removed" };
//   } catch (err) {
//     console.error("Error deleting time table:", err.message);
//     throw new Error("Failed to delete time table");
//   }
// };

// // Update Time Table by ID
// const updateTimeTableById = async (id, schedule) => {
//   try {
//     const updatedTimeTable = await TimeTable.findByIdAndUpdate(
//       id,
//       { schedule },
//       { new: true }
//     );
//     if (!updatedTimeTable) {
//       throw new Error("Time table not found");
//     }
//     return updatedTimeTable;
//   } catch (err) {
//     console.error("Error updating time table:", err.message);
//     throw new Error("Failed to update time table");
//   }
// };

// module.exports = {
//   createTimeTable,
//   getTimeTableByFacultyId,
//   deleteTimeTableById,
//   updateTimeTableById,
// };

// // controllers/timeTableController.js

// const TimeTable = require("../models/TimeTable");
// const asyncWrapper = require("../middlewares/asyncWrapper");

// // Create a new time table
// exports.createTimeTable = asyncWrapper(async (req, res) => {
//   const { facultyId, schedule } = req.body;
//   const timeTable = await TimeTable.create({ facultyId, schedule });
//   res.status(201).json(timeTable);
// });

// // Get time table by faculty ID
// exports.getTimeTableByFaculty = asyncWrapper(async (req, res) => {
//   const { facultyId } = req.params;
//   const timeTable = await TimeTable.findOne({ facultyId });
//   res.status(200).json(timeTable);
// });

// // Update time table
// exports.updateTimeTable = asyncWrapper(async (req, res) => {
//   const { id } = req.params;
//   const { schedule } = req.body;
//   const timeTable = await TimeTable.findByIdAndUpdate(
//     id,
//     { schedule },
//     { new: true }
//   );
//   res.status(200).json(timeTable);
// });

// // Delete time table
// exports.deleteTimeTable = asyncWrapper(async (req, res) => {
//   const { id } = req.params;
//   await TimeTable.findByIdAndDelete(id);
//   res.status(200).json({ message: "Time Table deleted successfully" });
// });
