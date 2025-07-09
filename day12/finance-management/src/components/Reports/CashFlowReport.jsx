import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function getMonthYear(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

const CashFlowReport = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('financeapp_user'));
    if (!user) return;
    const allTransactions = JSON.parse(localStorage.getItem('financeapp_transactions') || '[]');
    const userTransactions = allTransactions.filter(t => t.userId === user.id);
    const grouped = {};
    userTransactions.forEach(t => {
      const month = getMonthYear(t.date);
      if (!grouped[month]) grouped[month] = { month, income: 0, expense: 0 };
      if (t.type === 'income') grouped[month].income += Number(t.amount);
      if (t.type === 'expense') grouped[month].expense += Number(t.amount);
    });
    const chartData = Object.values(grouped).sort((a, b) => a.month.localeCompare(b.month)).map(row => ({
      ...row,
      net: row.income - row.expense
    }));
    setData(chartData);
  }, []);

  return (
    <div>
      <h4>Cash Flow (Monthly)</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#28a745" name="Income" />
          <Bar dataKey="expense" fill="#dc3545" name="Expenses" />
          <Bar dataKey="net" fill="#007bff" name="Net Cash Flow" />
        </BarChart>
      </ResponsiveContainer>
      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Month</th>
            <th>Income</th>
            <th>Expenses</th>
            <th>Net Cash Flow</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.month}>
              <td>{row.month}</td>
              <td className="text-success">₹{row.income.toLocaleString()}</td>
              <td className="text-danger">₹{row.expense.toLocaleString()}</td>
              <td className={row.net >= 0 ? 'text-success' : 'text-danger'}>₹{row.net.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CashFlowReport;
