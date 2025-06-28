// components/AdminPage.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const AdminPage = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const snapshot = await getDocs(collection(db, "quizResults"));
      const filtered = snapshot.docs
        .map((doc) => doc.data())
        .filter((res) => res.email !== "admin@example.com" && res.submittedAt); // exclude admin + only submitted users
      setResults(filtered);
    };
    fetchResults();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📊 Student Quiz Submissions
      </h1>
      {results.length === 0 ? (
        <p className="text-center text-gray-600">No submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Score</th>
                <th className="p-2 border">Percentage</th>
                <th className="p-2 border">Grade</th>
                <th className="p-2 border">Time Spent</th>
                <th className="p-2 border">Total Questions</th>
                <th className="p-2 border">Unanswered</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, idx) => {
                const unanswered = Array.isArray(r.answers)
                  ? r.answers.filter(
                      (ans) => !ans.selected || ans.selected === "Unanswered"
                    ).length
                  : "-";

                return (
                  <tr key={idx} className="text-center">
                    <td className="p-2 border">{r.name}</td>
                    <td className="p-2 border">{r.email}</td>
                    <td className="p-2 border">{r.score}</td>
                    <td className="p-2 border">
                      {Number(r.percentage)?.toFixed(1)}%
                    </td>
                    <td className="p-2 border">{r.grade}</td>
                    <td className="p-2 border">
                      {Math.floor(r.timeSpent / 60)}m {r.timeSpent % 60}s
                    </td>
                    <td className="p-2 border">{r.answers?.length || 0}</td>
                    <td className="p-2 border">{unanswered}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
