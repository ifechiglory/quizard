// App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import QuizPage from "./components/QuizPage";
import ResultPage from "./components/ResultPage";
import AdminPage from "./components/AdminPage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [quizDone, setQuizDone] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfSubmitted = async () => {
      if (!userEmail) return;

      const userRef = doc(db, "quizResults", userEmail);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserName(data.name || "");

        if (data.score !== undefined) {
          setQuizDone(true);
          setQuizResult({
            score: data.score,
            answers: data.answers,
            percentage: data.percentage,
            grade: data.grade,
            timeSpent: data.timeSpent,
          });
        } else if (data.answers) {
          setResumeData({
            answers: data.answers,
            timeLeft: data.timeLeft,
          });
        }
      }
    };
    checkIfSubmitted();
  }, [userEmail]);

  const handleLogin = async (email, name) => {
    if (!email || !name) {
      alert("Please enter both name and email.");
      return;
    }

    if (email === "admin@example.com") {
      navigate("/admin");
      return;
    }

    setUserEmail(email);
    setUserName(name);

    const userRef = doc(db, "quizResults", email);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name,
        email,
        startedAt: new Date().toISOString(),
        answers: [],
        timeLeft: 3600,
      });
    }

    navigate("/");
  };

  const handleLogout = () => {
    setUserEmail(null);
    setUserName(null);
    setQuizDone(false);
    setQuizResult(null);
    setResumeData(null);
    navigate("/", { replace: true });
  };

  const handleSubmit = (result) => {
    setQuizResult(result);
    setQuizDone(true);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          userEmail ? (
            quizDone ? (
              <ResultPage
                score={quizResult.score}
                answers={quizResult.answers}
                percentage={quizResult.percentage}
                grade={quizResult.grade}
                timeSpent={quizResult.timeSpent}
                onLogout={handleLogout}
              />
            ) : (
              <QuizPage
                user={userEmail}
                userName={userName}
                resumeData={resumeData}
                onSubmit={handleSubmit}
              />
            )
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        }
      />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
