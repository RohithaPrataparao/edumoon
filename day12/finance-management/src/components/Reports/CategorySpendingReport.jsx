import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28', '#FF4444', '#0088FE', '#AA336A', '#FFB6C1', '#A9A9A9', '#FFD700', '#20B2AA', '#FF6347', '#4682B4'
];

const CategorySpendingReport = () => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('financeapp_user'));
    if (!user) return;
    const allTransactions = JSON.parse(localStorage.getItem('financeapp_transactions') || '[]');
    const userTransactions = allTransactions.filter(t => t.userId === user.id && t.type === 'expense');
    const categoryTotals = {};
    userTransactions.forEach(t => {
      if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
      categoryTotals[t.category] += Number(t.amount);
    });
    const data = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
    setCategoryData(data);
  }, []);

  return (
    <div>
      <h4>Category Spending</h4>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {categoryData.map((entry, idx) => (
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
            <th>Category</th>
            <th>Total Spent</th>
          </tr>
        </thead>
        <tbody>
          {categoryData.map(row => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>₹{row.value.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategorySpendingReport;
