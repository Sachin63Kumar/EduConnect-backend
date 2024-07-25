const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
    },
    timeDuration: {
      type: Number,
    },
    numberOfAttempts: {
      type: Number,
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    questions: [
      {
        questionText: String,
        questionType: String,
        options: [String],
        correctAnswer: String,
        points: Number,
      },
    ],
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;

// const mongoose = require("mongoose");

// const questionSchema = new mongoose.Schema({
//   questionType: String,
//   questionText: String,
//   options: [String], // For MCQs
//   correctAnswer: String, // For MCQs, True/False, Fill in the blank
//   points: Number, // Points for each question
// });

// const quizSchema = new mongoose.Schema({
//   courseId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Course",
//     required: true,
//   },
//   title: { type: String, required: true },
//   instructions: { type: String },
//   timeDuration: { type: Number }, // Duration in minutes
//   questions: [questionSchema],
// });

// module.exports = mongoose.model("Quiz", quizSchema);
