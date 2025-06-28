// App.jsx
import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import QuizPage from "./components/QuizPage";
import ResultPage from "./components/ResultPage";
import AdminPage from "./components/AdminPage";
import { collection, getDocs, query, where, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [quizDone, setQuizDone] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const navigate = useNavigate();


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

  // const handleLogin = (email, name) => {
  //   setUserEmail(email);
  //   setUserName(name);
  // };

  const handleLogin = async (email, name) => {
    if (!email || !name) {
      alert("Please enter both email and name");
      return;
    }
    if (email === "admin@example.com") {
      setUserEmail(email);
      setUserName(name);
      navigate("/admin");
      return;
    }

    setUserEmail(email);
    setUserName(name);

    const userRef = doc(db, "quizResults", email);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      setQuizDone(true);
      setQuizResult({
        score: data.score || 0,
        answers: data.answers || [],
        submittedAt: data.submittedAt || null,
      });
      navigate("/result");
    } else {
      await setDoc(userRef, {
        name,
        email,
        startedAt: new Date().toISOString(),
      });
      navigate("/quiz");
    }
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
  );
}

export default App;
