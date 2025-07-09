import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6699', '#FF4444'];

const DashboardPieCharts = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [goalContributions, setGoalContributions] = useState([]);

  const getUserData = (key) => {
    const owner = localStorage.getItem('financeapp_data_owner');
    return JSON.parse(localStorage.getItem(`${key}_${owner}`)) || [];
  };

  useEffect(() => {
    setTransactions(getUserData('financeapp_transactions'));
    setBudgets(getUserData('financeapp_budgets'));
    setGoals(getUserData('financeapp_goals'));
    setGoalContributions(getUserData('financeapp_goal_contributions'));
  }, []);

  // Pie 1: Expense breakdown by category (current month)
  const currentMonth = new Date().toISOString().slice(0, 7);
  const expenseByCategory = {};
  transactions.forEach(txn => {
    if (txn.type === 'expense' && txn.date.startsWith(currentMonth)) {
      expenseByCategory[txn.category] = (expenseByCategory[txn.category] || 0) + Number(txn.amount);
    }
  });
  const expenseData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  // Pie 2: Budget utilization (current month)
  const budgetData = budgets.filter(b => b.period === currentMonth).map(b => {
    const spent = expenseByCategory[b.category] || 0;
    return {
      name: b.category,
      value: Math.min((spent / b.amount) * 100, 100),
    };
  });

  // Pie 3: Goal progress (use goal contributions)
  const goalData = goals.map(goal => {
    const total = goalContributions
      .filter(c => c.goalName === goal.name)
      .reduce((sum, c) => sum + Number(c.amount), 0);
    return {
      name: goal.name,
      value: goal.targetAmount ? Math.min((total / goal.targetAmount) * 100, 100) : 0,
    };
  });

  return (
    <div className="row">
      <motion.div className="col-md-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} whileHover={{ scale: 1.03 }}>
        <h5>Expenses by Category</h5>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {expenseData.map((entry, idx) => <Cell key={`cell-exp-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
      <motion.div className="col-md-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} whileHover={{ scale: 1.03 }}>
        <h5>Budget Utilization (%)</h5>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={budgetData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {budgetData.map((entry, idx) => <Cell key={`cell-budg-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
      <motion.div className="col-md-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} whileHover={{ scale: 1.03 }}>
        <h5>Goal Progress (%)</h5>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={goalData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {goalData.map((entry, idx) => <Cell key={`cell-goal-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default DashboardPieCharts;
