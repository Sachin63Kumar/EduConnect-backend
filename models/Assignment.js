// const mongoose = require("mongoose");

// const assignmentSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     instructions: { type: String, required: true },
//     descriptionFile: { type: String, required: true },
//     deadline: { type: Date, required: true },
//     course: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Course",
//       required: true,
//     },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     submissions: [
//       {
//         student: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//           required: true,
//         },
//         submissionFile: { type: String, required: true },
//         submittedAt: { type: Date, default: Date.now },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Assignment", assignmentSchema);

// const mongoose = require("mongoose");

// const assignmentSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     instructions: { type: String, required: true },
//     descriptionFile: { type: String, required: true },
//     deadline: { type: Date, required: true },
//     course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     submissions: [
//       {
//         student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         submissionFile: { type: String },
//         submittedAt: { type: Date, default: Date.now },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Assignment", assignmentSchema);

// const mongoose = require("mongoose");

// const assignmentSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     instructions: {
//       type: String,
//       required: true,
//     },
//     descriptionFile: {
//       type: String,
//       required: true,
//     },
//     deadline: {
//       type: Date,
//       required: true,
//     },
//     course: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Course",
//       required: true,
//     },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     submissions: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Submission",
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Assignment", assignmentSchema);

const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    instructions: { type: String, required: true },
    descriptionFile: { type: String, required: true },
    deadline: { type: Date, required: true },
    marks: { type: Number, required: true },
    submissions: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        submissionFile: { type: String },
        marksObtained: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
