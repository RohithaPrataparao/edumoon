import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  '', 'Food', 'Entertainment', 'Transport', 'Vacation Savings', 'Other'
];

const TransactionFilter = ({ setFilter }) => {
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    setFilter({ category, type });
  }, [category, type, setFilter]);

  return (
    <div className="row mb-3">
      <div className="col-md-4">
        <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat || 'All Categories'}</option>)}
        </select>
      </div>
      <div className="col-md-4">
        <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
    </div>
  );
};

export default TransactionFilter;
