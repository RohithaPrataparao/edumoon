import React, { useEffect, useState } from 'react';

const TransactionHistoryReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState({ type: '', category: '', search: '' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('financeapp_user'));
    if (!user) return;
    const allTransactions = JSON.parse(localStorage.getItem('financeapp_transactions') || '[]');
    setTransactions(allTransactions.filter(t => t.userId === user.id));
  }, []);

  const filtered = transactions.filter(t =>
    (!filter.type || t.type === filter.type) &&
    (!filter.category || t.category === filter.category) &&
    (!filter.search || t.note?.toLowerCase().includes(filter.search.toLowerCase()))
  );

  const categories = Array.from(new Set(transactions.map(t => t.category)));

  return (
    <div>
      <h4>Transaction History</h4>
      <div className="row mb-3">
        <div className="col">
          <select className="form-control" value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}>
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="col">
          <select className="form-control" value={filter.category} onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}>
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="col">
          <input className="form-control" placeholder="Search note..." value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
        </div>
      </div>
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
          {filtered.map((t, idx) => (
            <tr key={idx}>
              <td>{t.date}</td>
              <td>{t.type}</td>
              <td>{t.category}</td>
              <td className={t.type === 'income' ? 'text-success' : 'text-danger'}>₹{Number(t.amount).toLocaleString()}</td>
              <td>{t.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && <div className="text-muted">No transactions found.</div>}
    </div>
  );
};

export default TransactionHistoryReport;
