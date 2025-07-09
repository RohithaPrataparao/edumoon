import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const INCOME_CATEGORIES = [
  'Salary',
  'Business',
  'Interest',
  'Investment',
  'Gift',
  'Other Income'
];

const EXPENSE_CATEGORIES = [
  'Food',
  'Entertainment',
  'Transport',
  'Vacation Savings',
  'Goal Contribution',
  'Other Expense'
];

const TransactionForm = ({ onSave, onCancel, initialData }) => {
  const [form, setForm] = useState(
    initialData || {
      id: Date.now().toString(),
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().slice(0, 10),
      note: '',
      isGoalContribution: false,
      goalId: null
    }
  );

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  // Choose categories based on type
  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <motion.div className="modal-content" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.3 }}>
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{initialData ? 'Edit' : 'Add'} Transaction</h5>
              <button type="button" className="btn-close" onClick={onCancel}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Amount</label>
                <input type="number" className="form-control" name="amount" value={form.amount} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Type</label>
                <select className="form-select" name="type" value={form.type} onChange={handleChange} required>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select className="form-select" name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Select</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Date</label>
                <input type="date" className="form-control" name="date" value={form.date} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Note</label>
                <input type="text" className="form-control" name="note" value={form.note} onChange={handleChange} />
              </div>
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" name="isGoalContribution" checked={form.isGoalContribution} onChange={handleChange} id="goalContributionCheck" />
                <label className="form-check-label" htmlFor="goalContributionCheck">
                  Mark as Goal Contribution
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <motion.button type="button" className="btn btn-secondary" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={onCancel}>Cancel</motion.button>
              <motion.button type="submit" className="btn btn-primary" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>Save</motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default TransactionForm;
