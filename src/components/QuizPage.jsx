// 5. components/QuizPage.jsx
import React, { useEffect, useState } from "react";
import questionsData from "../data/questions.json";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const shuffle = (arr) => arr.sort(() => 0.5 - Math.random());

const QuizPage = ({ user, userName, onSubmit, onFinish }) => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 1 hour in seconds
  const [showWarning, setShowWarning] = useState({
    twenty: false,
    five: false,
  });

  useEffect(() => {
    const randomQuestions = shuffle([...questionsData]).slice(0, 50);
    setQuestions(randomQuestions);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      const finalAnswers = answers;
      const score = finalAnswers.filter((a) => a.selected === a.answer).length;
      saveResultToFirestore(user, userName, finalAnswers, score, 60 * 60);
      onSubmit({ score, answers: finalAnswers });
      onFinish();
      return;
    }

    if (timeLeft === 20 * 60 && !showWarning.twenty) {
      alert("⏰ 20 minutes remaining!");
      setShowWarning((prev) => ({ ...prev, twenty: true }));
    }
    if (timeLeft === 5 * 60 && !showWarning.five) {
      alert("⚠️ 5 minutes remaining! Finish up!");
      setShowWarning((prev) => ({ ...prev, five: true }));
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, user, userName, answers, onFinish, onSubmit, showWarning]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const saveResultToFirestore = async (
    user,
    name,
    answers,
    score,
    timeSpent
  ) => {
    try {
      await addDoc(collection(db, "quizResults"), {
        name,
        email: user,
        answers,
        score,
        percentage: Math.round((score / answers.length) * 100),
        timeSpent,
        submittedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving result:", error);
    }
  };

  const handleAnswer = (option) => {
    const updatedAnswers = [
      ...answers,
      { ...questions[current], selected: option },
    ];
    setAnswers(updatedAnswers);

    if (current + 1 === questions.length) {
      const finalAnswers = updatedAnswers;
      const score = finalAnswers.filter((a) => a.selected === a.answer).length;
      saveResultToFirestore(
        user,
        userName,
        finalAnswers,
        score,
        60 * 60 - timeLeft
      );
      onSubmit({ score, answers: finalAnswers });
      onFinish();
    } else {
      setCurrent(current + 1);
    }
  };

  if (!questions.length)
    return <p className="p-8 text-center">Loading questions...</p>;

  const q = questions[current];
  const timerClass = timeLeft <= 5 * 60 ? "text-red-600" : "text-blue-600";

  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Question {current + 1} of {questions.length}
        </h2>
        <span className={`${timerClass} font-semibold`}>
          Time Left: {formatTime(timeLeft)}
        </span>
      </div>
      <p className="mb-4 text-lg">{q.question}</p>
      <div className="space-y-2">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(opt)}
            className="block w-full px-4 py-2 border rounded hover:bg-blue-100"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizPage;
