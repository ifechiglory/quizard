// components/AdminPage.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const AdminPage = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const snapshot = await getDocs(collection(db, "quizResults"));
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((r) => r.score !== undefined); // Only show completed
      setResults(data);
    };

    fetchResults();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📊 Admin Dashboard</h1>

      <div className="overflow-auto">
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Score</th>
              <th className="border px-4 py-2">Percentage</th>
              <th className="border px-4 py-2">Grade</th>
              <th className="border px-4 py-2">Time Spent (mins)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, idx) => (
              <tr key={idx} className="text-center">
                <td className="border px-4 py-2">{r.name || "-"}</td>
                <td className="border px-4 py-2">{r.email || r.id}</td>
                <td className="border px-4 py-2">{r.score}</td>
                <td className="border px-4 py-2">
                  {typeof r.percentage === "number"
                    ? `${r.percentage.toFixed(1)}%`
                    : "-"}
                </td>
                <td className="border px-4 py-2">{r.grade || "-"}</td>
                <td className="border px-4 py-2">
                  {Math.ceil((r.timeSpent || 0) / 60)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
