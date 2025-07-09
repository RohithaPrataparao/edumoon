import React, { useEffect, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';

const BudgetPerformanceReport = () => {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('financeapp_user'));
    if (!user) return;
    const allBudgets = JSON.parse(localStorage.getItem('financeapp_budgets') || '[]');
    const allTransactions = JSON.parse(localStorage.getItem('financeapp_transactions') || '[]');
    setBudgets(allBudgets.filter(b => b.userId === user.id));
    setTransactions(allTransactions.filter(t => t.userId === user.id && t.type === 'expense'));
  }, []);

  const getSpent = (category) => {
    return transactions.filter(t => t.category === category).reduce((sum, t) => sum + Number(t.amount), 0);
  };

  return (
    <div>
      <h4>Budget Performance</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Category</th>
            <th>Budget Limit</th>
            <th>Spent</th>
            <th>Status</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map(budget => {
            const spent = getSpent(budget.category);
            const percent = Math.min(100, (spent / budget.amount) * 100);
            return (
              <tr key={budget.id}>
                <td>{budget.category}</td>
                <td>₹{Number(budget.amount).toLocaleString()}</td>
                <td>₹{spent.toLocaleString()}</td>
                <td>{spent > budget.amount ? <span className="text-danger">Over</span> : <span className="text-success">Under</span>}</td>
                <td style={{minWidth:120}}><ProgressBar now={percent} label={`${percent.toFixed(0)}%`} variant={spent > budget.amount ? 'danger' : 'success'} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetPerformanceReport;
