import React, { useEffect, useState } from 'react';

const RecurringTransactionsReport = () => {
  const [recurring, setRecurring] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('financeapp_user'));
    if (!user) return;
    const allTransactions = JSON.parse(localStorage.getItem('financeapp_transactions') || '[]');
    const userTransactions = allTransactions.filter(t => t.userId === user.id);
    // Simple heuristic: recurring if note contains 'recurring', 'monthly', 'weekly', etc.
    const keywords = ['recurring', 'monthly', 'weekly', 'every', 'repeat', 'subscription'];
    const recurringTx = userTransactions.filter(t => t.note && keywords.some(k => t.note.toLowerCase().includes(k)));
    setRecurring(recurringTx);
  }, []);

  return (
    <div>
      <h4>Recurring Transactions</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {recurring.map((t, idx) => (
            <tr key={idx}>
              <td>{t.date}</td>
              <td>{t.type}</td>
              <td>{t.category}</td>
              <td>₹{Number(t.amount).toLocaleString()}</td>
              <td>{t.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {recurring.length === 0 && <div className="text-muted">No recurring transactions found.</div>}
    </div>
  );
};

export default RecurringTransactionsReport;
