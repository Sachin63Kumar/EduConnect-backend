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
