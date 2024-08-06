const mongoose = require("mongoose");

const quizScoreSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    attempts: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const QuizScore = mongoose.model("QuizScore", quizScoreSchema);
module.exports = QuizScore;
