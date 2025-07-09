import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#28a745', '#dc3545']; // Green for income, red for expenses

const IncomeVsExpensesReport = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const getUserTransactions = () => {
    const owner = localStorage.getItem('financeapp_data_owner');
    return JSON.parse(localStorage.getItem(`financeapp_transactions_${owner}`)) || [];
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('financeapp_user'));
    if (!user) return;
    const userTransactions = getUserTransactions();
    setTransactions(userTransactions);
    const incomeSum = userTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const expenseSum = userTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
    setIncome(incomeSum);
    setExpenses(expenseSum);
  }, []);

  const data = [
    { name: 'Income', value: income },
    { name: 'Expenses', value: expenses },
  ];

  return (
    <div>
      <h4>Income vs. Expenses</h4>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Type</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Income</td>
            <td className="text-success">₹{income.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Expenses</td>
            <td className="text-danger">₹{expenses.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default IncomeVsExpensesReport;
