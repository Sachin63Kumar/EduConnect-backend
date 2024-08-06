const express = require("express");
const router = express.Router();
const QuizController = require("../controllers/quizController");

// Get all quizzes for a specific course
router.get("/course/:courseId", QuizController.getQuizzesByCourse);

// Create a new quiz
router.post("/create", QuizController.createQuiz);

// Get a specific quiz
router.get("/:quizId", QuizController.getQuizById);

// Submit a quiz
router.post("/submit/:quizId", QuizController.submitQuiz);
router.get("/scores/:quizId", QuizController.getQuizScores);

module.exports = router;
