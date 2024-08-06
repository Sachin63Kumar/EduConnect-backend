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
