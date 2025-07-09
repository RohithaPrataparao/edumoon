import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  'Food',
  'Entertainment',
  'Transport',
  'Vacation Savings',
  'Other'
];

const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

const BudgetForm = ({ onSave, onCancel, initialData }) => {
  const [form, setForm] = useState(
    initialData || {
      id: Date.now().toString(),
      category: '',
      amount: '',
      period: getCurrentMonth(),
    }
  );

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{initialData ? 'Edit' : 'Add'} Budget</h5>
              <button type="button" className="btn-close" onClick={onCancel}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select className="form-select" name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Select</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Amount</label>
                <input type="number" className="form-control" name="amount" value={form.amount} onChange={handleChange} required />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BudgetForm;
