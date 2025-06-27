// App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import QuizPage from "./components/QuizPage";
import ResultPage from "./components/ResultPage";
import AdminPage from "./components/AdminPage";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [quizDone, setQuizDone] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    const checkIfSubmitted = async () => {
      if (userEmail) {
        const q = query(
          collection(db, "quizResults"),
          where("email", "==", userEmail)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setQuizDone(true);
          setQuizResult({ score: data.score, answers: data.answers });
        }
      }
    };
    checkIfSubmitted();
  }, [userEmail]);

  const handleLogin = (email, name) => {
    setUserEmail(email);
    setUserName(name);
  };

  const handleLogout = () => {
    setUserEmail(null);
    setUserName(null);
    setQuizDone(false);
    setQuizResult(null);
  };

  const handleSubmit = (result) => {
    setQuizResult(result);
    setQuizDone(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            userEmail ? (
              quizDone ? (
                <ResultPage
                  score={quizResult?.score || 0}
                  answers={quizResult?.answers || []}
                  onLogout={handleLogout}
                />
              ) : (
                <QuizPage
                  user={userEmail}
                  userName={userName}
                  onSubmit={handleSubmit}
                  onFinish={() => setQuizDone(true)}
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
    </Router>
  );
}

export default App;
