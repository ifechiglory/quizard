// App.jsx
import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import QuizPage from "./components/QuizPage";
import ResultPage from "./components/ResultPage";
import AdminPage from "./components/AdminPage";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function App() {
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [quizDone, setQuizDone] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [quizTime, setQuizTime] = useState(3600);

  const navigate = useNavigate();

  const handleLogin = async (email, name) => {
    if (!email || !name) {
      alert("Please enter both email and name");
      return;
    }

    if (email === "admin@example.com") {
      navigate("/admin");
      return;
    }

    const userRef = doc(db, "quizResults", email);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();

      if (data.score !== undefined && data.answers?.length) {
        // Quiz already submitted
        setUserEmail(email);
        setUserName(data.name || name);
        setQuizResult({
          score: data.score,
          answers: data.answers,
          percentage: data.percentage,
          grade: data.grade,
          timeSpent: data.timeSpent,
        });
        setQuizDone(true);
        navigate("/result");
      } else {
        // Started but not submitted
        setUserEmail(email);
        setUserName(data.name || name);
        setQuizTime(data.timeLeft || 3600);
        navigate("/quiz");
      }
    } else {
      // First login
      await setDoc(userRef, {
        name,
        email,
        startedAt: new Date().toISOString(),
        timeLeft: 3600,
      });
      setUserEmail(email);
      setUserName(name);
      setQuizTime(3600);
      navigate("/quiz");
    }
  };

  const handleLogout = () => {
    setUserEmail(null);
    setUserName(null);
    setQuizResult(null);
    setQuizDone(false);
    setQuizTime(3600);
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
                score={quizResult?.score || 0}
                answers={quizResult?.answers || []}
                percentage={quizResult?.percentage}
                grade={quizResult?.grade}
                timeSpent={quizResult?.timeSpent}
                onLogout={handleLogout}
              />
            ) : (
              <QuizPage
                user={userEmail}
                userName={userName}
                onSubmit={handleSubmit}
                initialTime={quizTime}
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
