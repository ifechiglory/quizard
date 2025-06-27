// components/AdminPage.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const AdminPage = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const snapshot = await getDocs(collection(db, "quizResults"));
      const data = snapshot.docs.map((doc) => doc.data());
      setResults(data);
    };
    fetchResults();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">📊 Admin Dashboard</h1>

      <div className="overflow-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Score</th>
              <th className="py-2 px-4 border">Percentage</th>
              <th className="py-2 px-4 border">Time Spent (sec)</th>
              <th className="py-2 px-4 border">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4 border">{res.name}</td>
                <td className="py-2 px-4 border">{res.email}</td>
                <td className="py-2 px-4 border">{res.score}</td>
                <td className="py-2 px-4 border">{res.percentage}%</td>
                <td className="py-2 px-4 border">{res.timeSpent}</td>
                <td className="py-2 px-4 border">
                  {new Date(res.submittedAt).toLocaleString()}
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