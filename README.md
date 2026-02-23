# 💰 Finance TrackFi

A responsive personal finance tracker built using **React**, **Firebase**, **Tailwind CSS**, and **Recharts**.

Users can securely manage their income and expenses, visualize financial data with charts, and track daily spending trends.

---

## 🚀 Live Demo

( Add your Render deployment link here )

---

## ✨ Features

- 🔐 Firebase Authentication (Email + Google Sign-in)
- ➕ Add Income & Expenses
- 🗑 Delete Transactions
- 🔄 Reset All Transactions
- 📊 Income vs Expense Pie Chart
- 📈 Category Breakdown Bar Chart
- 📉 Daily Trend Line Chart
- 🔍 Search Transactions
- 🎯 Filter by Income / Expense
- ↕ Sort by Date / Amount
- 📱 Fully Responsive (Mobile Friendly)

---

## 🛠 Tech Stack

- React (Vite)
- Firebase (Auth + Firestore)
- Tailwind CSS
- Recharts
- React Router

---

## 📂 Project Structure

```
src/
 ├── components/
 ├── pages/
 │    ├── Dashboard.jsx
 │    ├── Signin.jsx
 │    ├── Signup.jsx
 │    └── Profile.jsx
 ├── firebase/
 ├── AuthContext/
 └── ProtectedRoute/
```

---

## 🔐 Authentication

This app uses Firebase Authentication:

- Email & Password Login
- Google Sign-in
- Protected Routes
- Persistent Login Session

Each user’s data is securely stored under:

```
users/{userId}/transactions
```

---

## 📊 Charts

- Pie Chart → Income vs Expense
- Bar Chart → Category Breakdown
- Line Chart → Daily Income & Expense Trends

---

## 📱 Responsive Design

- Mobile-first layout
- Adaptive grid system
- Responsive charts
- Flexible transaction layout

---

## ⚙ Installation

Clone the repository:

```bash
git clone https://github.com/your-username/your-repo-name.git
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

---

## 🌍 Deployment

Deployed using **Render**.

---

## 📌 Future Improvements

- CSV Export / Import
- Monthly financial reports
- Budget limit alerts
- Dark Mode
- Advanced analytics

---

## 👨‍💻 Author

Built as a learning project to understand full-stack finance tracking with Firebase & React.

---

⭐ If you like this project, consider giving it a star!
