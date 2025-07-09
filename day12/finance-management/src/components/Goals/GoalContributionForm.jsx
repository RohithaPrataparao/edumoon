import React, { useState } from 'react';
import { motion } from 'framer-motion';

const GoalContributionForm = ({ onSave, onCancel }) => {
  const [form, setForm] = useState({
    goalName: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    note: ''
  });

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
        <motion.div className="modal-content" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.3 }}>
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Goal Contribution</h5>
              <button type="button" className="btn-close" onClick={onCancel}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Goal Name</label>
                <input type="text" className="form-control" name="goalName" value={form.goalName} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Amount</label>
                <input type="number" className="form-control" name="amount" value={form.amount} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Date of Contribution</label>
                <input type="date" className="form-control" name="date" value={form.date} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Note</label>
                <input type="text" className="form-control" name="note" value={form.note} onChange={handleChange} />
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

export default GoalContributionForm;
