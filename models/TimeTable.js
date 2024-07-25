const mongoose = require("mongoose");

const timeTableSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  schedule: {
    Monday: { type: Map, of: String, default: {} },
    Tuesday: { type: Map, of: String, default: {} },
    Wednesday: { type: Map, of: String, default: {} },
    Thursday: { type: Map, of: String, default: {} },
    Friday: { type: Map, of: String, default: {} },
    // Saturday: { type: Map, of: String, default: {} },
  },
});

const TimeTable = mongoose.model("TimeTable", timeTableSchema);

module.exports = TimeTable;

// const mongoose = require("mongoose");

// const timeTableSchema = mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "User",
//   },
//   schedule: {
//     Monday: { type: Object, default: {} },
//     Tuesday: { type: Object, default: {} },
//     Wednesday: { type: Object, default: {} },
//     Thursday: { type: Object, default: {} },
//     Friday: { type: Object, default: {} },
//     Saturday: { type: Object, default: {} },
//   },
// });

// const TimeTable = mongoose.model("TimeTable", timeTableSchema);

// module.exports = TimeTable;

// const mongoose = require("mongoose");

// const timeTableSchema = new mongoose.Schema(
//   {
//     facultyId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     schedule: {
//       Monday: { type: Map, of: String },
//       Tuesday: { type: Map, of: String },
//       Wednesday: { type: Map, of: String },
//       Thursday: { type: Map, of: String },
//       Friday: { type: Map, of: String },
//       // Saturday: { type: Map, of: String },
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("TimeTable", timeTableSchema);

// const mongoose = require("mongoose");

// const TimeTableSchema = new mongoose.Schema({
//   facultyId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   schedule: {
//     Monday: [
//       {
//         time: String,
//         courseName: String,
//       },
//     ],
//     Tuesday: [
//       {
//         time: String,
//         courseName: String,
//       },
//     ],
//     Wednesday: [
//       {
//         time: String,
//         courseName: String,
//       },
//     ],
//     Thursday: [
//       {
//         time: String,
//         courseName: String,
//       },
//     ],
//     Friday: [
//       {
//         time: String,
//         courseName: String,
//       },
//     ],
//     Saturday: [
//       {
//         time: String,
//         courseName: String,
//       },
//     ],
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("TimeTable", TimeTableSchema);
