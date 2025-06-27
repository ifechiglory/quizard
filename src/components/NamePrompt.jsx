// NamePrompt.jsx
import { useState } from "react";
export default function NamePrompt({ onSubmit }) {
  const [name, setName] = useState("");

  return (
    <div className="p-4 bg-white shadow rounded max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Enter Your Full Name</h2>
      <input
        type="text"
        className="border p-2 w-full rounded mb-4"
        placeholder="e.g., Chuka Ifeanyi"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={() => name && onSubmit(name)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Continue
      </button>
    </div>
  );
}
