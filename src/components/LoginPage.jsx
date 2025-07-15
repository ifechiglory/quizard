// components/LoginPage.jsx
import React, { useState } from "react";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@") || !name.trim()) {
      setError("Please enter a valid name and email");
      return;
    }
    onLogin(email.trim(), name.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
          >
            <h1 className="text-2xl font-bold mb-6 text-center">
              Welcome to the Frontend Quiz
            </h1>
            <div className="mb-4">
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
                placeholder="Jane Doe"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
                placeholder="jane@example.com"
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full bg-purple-800 font-semibold uppercase text-white py-2 rounded hover:bg-purple-700"
            >
              Start Quiz
            </button>
          </form>
    </div>
  );
};

export default LoginPage;
