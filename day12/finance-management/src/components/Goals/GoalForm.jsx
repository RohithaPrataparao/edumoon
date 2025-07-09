import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const GoalForm = ({ onSave, onCancel, initialData }) => {
  const [form, setForm] = useState(
    initialData || {
      id: Date.now().toString(),
      name: '',
      targetAmount: '',
      deadline: '',
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
        <motion.div className="modal-content" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.3 }}>
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{initialData ? 'Edit' : 'Add'} Goal</h5>
              <button type="button" className="btn-close" onClick={onCancel}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Goal Name</label>
                <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Target Amount</label>
                <input type="number" className="form-control" name="targetAmount" value={form.targetAmount} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Deadline</label>
                <input type="date" className="form-control" name="deadline" value={form.deadline} onChange={handleChange} required />
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

export default GoalForm;
