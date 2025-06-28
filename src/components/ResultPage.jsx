// components/ResultPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResultPage = ({
  score,
  answers,
  percentage,
  grade,
  timeSpent,
  onLogout,
}) => {
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(false);

  const getGradeBadge = (grade) => {
    const base = "inline-block px-4 py-1 rounded-full font-medium text-sm";
    switch (grade) {
      case "A":
        return `${base} bg-green-100 text-green-700`;
      case "B":
        return `${base} bg-blue-100 text-blue-700`;
      case "C":
        return `${base} bg-yellow-100 text-yellow-700`;
      default:
        return `${base} bg-red-100 text-red-700`;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleLogout = () => {
    onLogout();
    navigate("/", { replace: true });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 Quiz Completed!</h1>

      <div className="mb-6">
        <p className="text-lg font-medium">Your Score:</p>
        <p className="text-4xl font-bold">
          {score} / {answers.length}
        </p>
        <p className="text-xl text-gray-700">({Math.round(percentage)}%)</p>

        <div className={`mt-3 ${getGradeBadge(grade)}`}>Grade: {grade}</div>
        <p className="mt-2 text-sm text-gray-500">
          Time Spent: {formatTime(timeSpent || 0)}
        </p>
      </div>

      <div className="flex justify-center gap-4 mt-6 mb-8">
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showAnswers ? "Hide Answers" : "View Answers"}
        </button>
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          Logout
        </button>
      </div>

      {showAnswers && (
        <div className="mt-6 text-left">
          <h2 className="text-xl font-semibold mb-4">Answer Summary</h2>
          <ul className="space-y-4">
            {answers.map((item, idx) => {
              const isCorrect = item.selected === item.answer;
              const isUnanswered = item.selected === "Unanswered";
              return (
                <li key={idx} className="border rounded p-4">
                  <p className="font-semibold mb-1">
                    {idx + 1}. {item.question}
                  </p>
                  <p className="text-sm">
                    ✅ Correct Answer: <strong>{item.answer}</strong>
                  </p>
                  <p
                    className={`text-sm ${
                      isUnanswered
                        ? "text-gray-600"
                        : isCorrect
                        ? "text-green-700"
                        : "text-red-600"
                    }`}
                  >
                    📝 Your Answer: <strong>{item.selected}</strong>
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
