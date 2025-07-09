import React, { useEffect, useState } from 'react';

const SavingsRateReport = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('financeapp_user'));
    if (!user) return;
    const allTransactions = JSON.parse(localStorage.getItem('financeapp_transactions') || '[]');
    const userTransactions = allTransactions.filter(t => t.userId === user.id);
    const grouped = {};
    userTransactions.forEach(t => {
      const month = t.date.slice(0, 7); // YYYY-MM
      if (!grouped[month]) grouped[month] = { month, income: 0, expense: 0 };
      if (t.type === 'income') grouped[month].income += Number(t.amount);
      if (t.type === 'expense') grouped[month].expense += Number(t.amount);
    });
    const chartData = Object.values(grouped).sort((a, b) => a.month.localeCompare(b.month)).map(row => ({
      ...row,
      savings: row.income - row.expense,
      rate: row.income > 0 ? ((row.income - row.expense) / row.income) * 100 : 0
    }));
    setData(chartData);
  }, []);

  return (
    <div>
      <h4>Savings Rate (Monthly)</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Month</th>
            <th>Income</th>
            <th>Expenses</th>
            <th>Savings</th>
            <th>Savings Rate (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.month}>
              <td>{row.month}</td>
              <td className="text-success">₹{row.income.toLocaleString()}</td>
              <td className="text-danger">₹{row.expense.toLocaleString()}</td>
              <td className={row.savings >= 0 ? 'text-success' : 'text-danger'}>₹{row.savings.toLocaleString()}</td>
              <td>{row.rate.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SavingsRateReport;
