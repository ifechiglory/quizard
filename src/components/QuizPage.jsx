// components/QuizPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import questions from "../data/questions.json";

const QuizPage = ({
  user,
  userName,
  onSubmit,
  initialAnswers = [],
  initialTimeLeft = 3600,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const [answers, setAnswers] = useState(initialAnswers);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const unansweredCount = questions.length - answers.filter(Boolean).length;

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  // ✅ Safe submit function
  const handleSubmit = useCallback(async () => {
    const finalAnswers = questions.map((q, idx) => {
      const userAnswer = answers[idx]?.selected || "Unanswered";
      return {
        question: q.question,
        selected: userAnswer,
        answer: q.answer,
      };
    });

    const score = finalAnswers.reduce(
      (acc, q) => (q.selected === q.answer ? acc + 1 : acc),
      0
    );
    const percentage = (score / questions.length) * 100;
    const grade =
      percentage >= 80
        ? "A"
        : percentage >= 60
        ? "B"
        : percentage >= 50
        ? "C"
        : "F";

    if (user && score !== undefined && finalAnswers) {
      await updateDoc(doc(db, "quizResults", user), {
        score,
        answers: finalAnswers,
        percentage,
        grade,
        submittedAt: new Date().toISOString(),
        timeSpent: 3600 - timeLeft,
      });

      onSubmit({
        score,
        answers: finalAnswers,
        percentage,
        grade,
        timeSpent: 3600 - timeLeft,
      });

      navigate("/result");
    }
  }, [answers, user, timeLeft, navigate, onSubmit]);

  // 🕐 Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleSubmit]);

  // 📝 Answer selection
  const handleSelect = async (questionIndex, choice) => {
    const updated = [...answers];
    updated[questionIndex] = {
      question: questions[questionIndex].question,
      selected: choice,
      answer: questions[questionIndex].answer,
    };
    setAnswers(updated);

    // Save progress to Firestore
    if (user) {
      await setDoc(
        doc(db, "quizResults", user),
        {
          answers: updated,
          name: userName || "Anonymous",
          email: user,
          timeLeft,
        },
        { merge: true }
      );
    }
  };

  return (
    <div className="min-h-screen px-6 pt-8 pb-20 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Welcome, {userName} 👋</h1>

      <form className="space-y-8">
        {questions.map((q, index) => (
          <div key={index} className="border p-4 rounded shadow-sm">
            <p className="font-medium mb-2">
              {index + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={opt}
                    checked={answers[index]?.selected === opt}
                    onChange={() => handleSelect(index, opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
      </form>

      {/* Submit Button */}
      <div className="text-center mt-10">
        <button
          onClick={() => setShowConfirm(true)}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Submit Quiz
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full text-center">
            <h2 className="text-lg font-bold mb-2">Confirm Submission</h2>
            {unansweredCount > 0 && (
              <p className="text-red-600 text-sm mb-2">
                You have {unansweredCount} unanswered question
                {unansweredCount > 1 ? "s" : ""}.
              </p>
            )}
            <p className="mb-4">Are you sure you want to submit?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Yes, Submit
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-3 px-6 text-center font-medium shadow">
        Time Left: <span className="text-blue-600">{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
};

export default QuizPage;
