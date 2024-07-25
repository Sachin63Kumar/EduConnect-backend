const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true },
    facultyName: { type: String, required: true },
    numOfStudentEnrolled: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    status: {
      type: String,
      enum: ["completed", "in progress"],
      required: true,
    }, // Add status field
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);

// const mongoose = require("mongoose");

// const courseSchema = new mongoose.Schema(
//   {
//     courseName: { type: String, required: true },
//     facultyName: { type: String, required: true },
//     numOfStudentEnrolled: { type: Number, required: true },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Course", courseSchema);
