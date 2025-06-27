// components/ResultPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResultPage = ({ score, answers, onLogout }) => {
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(false);
  const total = answers.length;
  const percentage = Math.round((score / total) * 100);

  const getGrade = (percent) => {
    if (percent >= 80)
      return { label: "Excellent", color: "bg-green-100 text-green-700" };
    if (percent >= 50)
      return { label: "Fair", color: "bg-yellow-100 text-yellow-700" };
    return { label: "Needs Improvement", color: "bg-red-100 text-red-700" };
  };

  const grade = getGrade(percentage);

  const handleLogout = () => {
    onLogout();
    navigate("/", { replace: true });
  };

  if (!answers || answers.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">Loading your result...</p>
    );
  }
  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 Quiz Completed</h1>

      <div className="mb-6">
        <p className="text-lg">Your Score:</p>
        <p className="text-4xl font-bold">
          {score} / {total}
        </p>
        <p className="text-xl">({percentage}%)</p>

        <div
          className={`mt-4 inline-block px-4 py-2 rounded-full font-medium ${grade.color}`}
        >
          {grade.label}
        </div>
      </div>

      <div className="space-x-4">
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="px-4 py-2 bg-purple-800 text-white rounded hover:bg-purple-700"
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
                  <p className="text-sm">✅ Correct: {item.answer}</p>
                  <p
                    className={`text-sm ${
                      isCorrect ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    📝 Your Answer: {item.selected}
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