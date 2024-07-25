const Quiz = require("../models/Quiz");
const QuizScore = require("../models/QuizScore");
const Notification = require("../models/Notification");
const { getStudentsByCourse } = require("../utils/courseUtils");

exports.getQuizzesByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ courseId: req.params.courseId });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    await newQuiz.save();

    // Create notifications for students
    const students = await getStudentsByCourse(req.body.courseId);
    const notifications = students.map((student) => ({
      userId: student._id,
      courseId: req.body.courseId,
      type: "Quiz",
      message: `New quiz in course ${req.body.courseId}: ${req.body.title}`,
    }));
    await Notification.insertMany(notifications);

    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { userId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    const existingQuizScore = await QuizScore.findOne({
      quizId,
      studentId: userId,
    });
    if (
      existingQuizScore &&
      existingQuizScore.attempts >= quiz.numberOfAttempts
    ) {
      return res
        .status(400)
        .json({ error: "Maximum number of attempts reached" });
    }

    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        score += question.points;
      }
    });

    if (existingQuizScore) {
      existingQuizScore.score = score;
      existingQuizScore.attempts += 1;
      await existingQuizScore.save();
    } else {
      const quizScore = new QuizScore({
        quizId,
        studentId: userId,
        score,
        attempts: 1,
      });
      await quizScore.save();
    }

    res.status(200).json({ message: "Quiz submitted", score });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuizScores = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quizScores = await QuizScore.find({ quizId }).populate(
      "studentId",
      "name email"
    );
    res.status(200).json(quizScores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const Quiz = require("../models/Quiz");
// const QuizScore = require("../models/QuizScore");
// const User = require("../models/User");

// // Get all quizzes for a specific course
// exports.getQuizzesByCourse = async (req, res) => {
//   try {
//     const quizzes = await Quiz.find({ courseId: req.params.courseId });
//     res.status(200).json(quizzes);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Create a new quiz
// exports.createQuiz = async (req, res) => {
//   try {
//     const newQuiz = new Quiz(req.body);
//     await newQuiz.save();
//     res.status(201).json(newQuiz);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get a specific quiz
// exports.getQuizById = async (req, res) => {
//   try {
//     const quiz = await Quiz.findById(req.params.quizId);
//     res.status(200).json(quiz);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.submitQuiz = async (req, res) => {
//   try {
//     const { quizId } = req.params;
//     const { userId, answers } = req.body;

//     const quiz = await Quiz.findById(quizId);
//     if (!quiz) return res.status(404).json({ error: "Quiz not found" });

//     // Check the number of attempts
//     const existingQuizScore = await QuizScore.findOne({
//       quizId,
//       studentId: userId,
//     });
//     if (
//       existingQuizScore &&
//       existingQuizScore.attempts >= quiz.numberOfAttempts
//     ) {
//       return res
//         .status(400)
//         .json({ error: "Maximum number of attempts reached" });
//     }

//     let score = 0;
//     quiz.questions.forEach((question, index) => {
//       if (question.correctAnswer === answers[index]) {
//         score += question.points;
//       }
//     });

//     if (existingQuizScore) {
//       existingQuizScore.score = score;
//       existingQuizScore.attempts += 1;
//       await existingQuizScore.save();
//     } else {
//       const quizScore = new QuizScore({
//         quizId,
//         studentId: userId,
//         score,
//         attempts: 1,
//       });
//       await quizScore.save();
//     }

//     res.json({ score });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // Function to get quiz scores
// exports.getQuizScores = async (req, res) => {
//   try {
//     const { quizId } = req.params;
//     const scores = await QuizScore.find({ quizId }).populate(
//       "studentId",
//       "name email"
//     );
//     res.json(scores);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// Submit a quiz
// exports.submitQuiz = async (req, res) => {
//   const { quizId } = req.params;
//   const { userId, answers } = req.body;

//   try {
//     const quiz = await Quiz.findById(quizId);
//     if (!quiz) {
//       return res.status(404).json({ message: "Quiz not found" });
//     }

//     let score = 0;

//     quiz.questions.forEach((question, index) => {
//       if (
//         question.questionType === "MCQ" ||
//         question.questionType === "True/False"
//       ) {
//         if (answers[index] === question.correctAnswer) {
//           score += question.points;
//         }
//       } else if (question.questionType === "Fill in the Blank") {
//         if (
//           answers[index].toLowerCase() === question.correctAnswer.toLowerCase()
//         ) {
//           score += question.points;
//         }
//       }
//     });

//     // Save the result to the user's data (optional, based on your requirements)
//     const user = await User.findById(userId);
//     if (user) {
//       if (!user.quizResults) {
//         user.quizResults = [];
//       }
//       user.quizResults.push({ quizId, score });
//       await user.save();
//     }

//     res.status(200).json({ score });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.submitQuiz = async (req, res) => {
//   try {
//     const { quizId } = req.params;
//     const { userId, answers } = req.body;

//     const quiz = await Quiz.findById(quizId);
//     if (!quiz) return res.status(404).json({ error: "Quiz not found" });

//     let score = 0;

//     quiz.questions.forEach((question, index) => {
//       if (question.correctAnswer === answers[index]) {
//         score += question.points;
//       }
//     });

//     const quizScore = new QuizScore({
//       quizId,
//       studentId: userId,
//       score,
//     });
//     await quizScore.save();

//     res.json({ score });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // Function to get quiz scores
// exports.getQuizScores = async (req, res) => {
//   try {
//     const { quizId } = req.params;
//     const scores = await QuizScore.find({ quizId }).populate(
//       "studentId",
//       "name email"
//     );
//     res.json(scores);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };
