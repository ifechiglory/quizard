# Quizard

This is a fully functional frontend quiz application built with **React**, **Tailwind CSS**, and **Firebase**. It features user login, random question delivery, timed sessions, detailed result tracking, and an admin dashboard to view all submissions.

---

## 📦 Features

### 👨‍🎓 For Users

* **Email-based login** ---
* **Randomized** beginner-level questions on HTML, CSS, and Tailwind
* **Timer** with one-hour limit, plus visual warnings at 20 and 5 minutes
* **Answer review** after submission
* **Score grading** with color-coded performance bands
* **Prevents double submissions** by checking Firestore

## 🛠️ Technologies Used

* [React](https://reactjs.org/)
* [Tailwind CSS v4](https://tailwindcss.com/)
* [Firebase (Firestore)](https://firebase.google.com/)
* [React Router](https://reactrouter.com/)

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/frontend-quiz-app.git
cd frontend-quiz-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

* Create a project at [Firebase Console](https://console.firebase.google.com/)
* Enable **Firestore**
* Copy your Firebase config object
* Replace the contents of `firebase.js`:

```js
// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_BUCKET',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### 4. Start the Development Server

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Quiz Structure

* Questions are stored in a local `questions.json` file
* Each question includes:

```json
{
  "question": "What does the following CSS rule do?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "Correct Option"
}
```

* You can add more questions manually or link to Firestore if preferred

---

## 🔒 Access Control

* If the user logs in as `admin@example.com`, they’re sent to `/admin`
* All others go straight to the quiz page
* Repeat login by same email = redirected to result page (no resubmission)

---

---

## 📁 Project Structure

src/
├── components/
│   ├── Login.jsx
│   ├── QuizPage.jsx
│   ├── ResultPage.jsx
│   ├── AdminPage.jsx
├── data/
│   └── questions.json
├── firebase.js
├── App.jsx
└── main.jsx

---

## 🚀 Build for Production

```bash
npm run build
```

Then deploy with [Netlify](https://netlify.com), [Vercel](https://vercel.com), or Firebase Hosting.

---

## 📫 Contributing & Feedback

Pull requests and suggestions are welcome! 💬

---

## 🧠 Credits

Crafted with ❤️ for Attueyi Coding Academy frontend students.
Feel free to use this app in your course, bootcamp, or project portfolio.
