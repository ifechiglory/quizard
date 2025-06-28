// components/ResultPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResultPage = ({
  score,
  answers = [],
  percentage,
  grade,
  timeSpent,
  onLogout,
}) => {
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(false);

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A":
        return "bg-green-100 text-green-700";
      case "B":
      case "C":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate("/", { replace: true });
  };

  return (
    <div className="p-8 max-w-3xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 Quiz Completed</h1>

      <div className="mb-6">
        <p className="text-lg">Your Score:</p>
        <p className="text-4xl font-bold">
          {score} / {answers.length}
        </p>
        <p className="text-xl mb-1">({Math.round(percentage)}%)</p>
        <p className="text-sm text-gray-600 mb-2">
          Time Spent: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
        </p>

        <div
          className={`inline-block px-4 py-2 rounded-full font-medium ${getGradeColor(
            grade
          )}`}
        >
          Grade: {grade}
        </div>
      </div>

      <div className="space-x-4 mb-6">
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showAnswers ? "Hide Answers" : "View Answers"}
        </button>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {showAnswers && (
        <div className="mt-8 text-left">
          <h2 className="text-xl font-bold mb-4">Review Your Answers</h2>
          <ul className="space-y-4">
            {answers.map((item, idx) => {
              const isCorrect = item.selected === item.answer;
              return (
                <li key={idx} className="p-4 border rounded">
                  <p className="font-semibold">
                    {idx + 1}. {item.question}
                  </p>
                  <p className="text-sm text-green-600">
                    ✅ Correct: {item.answer}
                  </p>
                  <p
                    className={`text-sm ${
                      item.selected === "Unanswered"
                        ? "text-gray-500"
                        : isCorrect
                        ? "text-green-700"
                        : "text-red-600"
                    }`}
                  >
                    📝 Your Answer: {item.selected || "Unanswered"}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
