import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Auth from './components/Auth/Auth';
import Dashboard from './components/Dashboard/Dashboard';
import TransactionsList from './components/Transactions/TransactionsList';
import Budgets from './components/Budgets/Budgets';
import Reports from './components/Reports/Reports';
import Goals from './components/Goals/Goals';

// Auth guard for protected routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('financeapp_token');
  return token ? children : <Navigate to="/auth" replace />;
};

function HomeMenu() {
  return (
    <div className="text-center mt-5 neu-card p-4">
      <h1>Welcome to FinanceApp</h1>
    </div>
  );
}

function App() {
  // Dark mode state and effect
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('financeapp_darkmode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('financeapp_darkmode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(dm => !dm);

  return (
    <Router>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className={`container${darkMode ? ' dark-mode' : ''}`}>
        <Routes>
          <Route path="/auth/*" element={<Auth />} />
          <Route path="/" element={<PrivateRoute><HomeMenu /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><TransactionsList /></PrivateRoute>} />
          <Route path="/budgets" element={<PrivateRoute><Budgets /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="/goals" element={<PrivateRoute><Goals /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
