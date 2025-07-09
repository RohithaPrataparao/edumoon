import React, { useState, useEffect } from 'react';
import TransactionForm from './TransactionForm';
import TransactionFilter from './TransactionFilter';
import { motion, AnimatePresence } from 'framer-motion';

const TRANSACTIONS_KEY = 'financeapp_transactions';

const getTransactions = () => {
  const owner = localStorage.getItem('financeapp_data_owner');
  return JSON.parse(localStorage.getItem(`${TRANSACTIONS_KEY}_${owner}`)) || [];
};

const saveTransactions = (txns) => {
  const owner = localStorage.getItem('financeapp_data_owner');
  localStorage.setItem(`${TRANSACTIONS_KEY}_${owner}`, JSON.stringify(txns));
};

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editTxn, setEditTxn] = useState(null);

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const handleAdd = (txn) => {
    const txns = [...transactions, txn];
    setTransactions(txns);
    saveTransactions(txns);
    setShowForm(false);
  };

  const handleEdit = (txn) => {
    const txns = transactions.map(t => t.id === txn.id ? txn : t);
    setTransactions(txns);
    saveTransactions(txns);
    setEditTxn(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const txns = transactions.filter(t => t.id !== id);
    setTransactions(txns);
    saveTransactions(txns);
  };

  // Simple filter logic (expand as needed)
  const filteredTxns = transactions.filter(t => {
    if (filter.category && t.category !== filter.category) return false;
    if (filter.type && t.type !== filter.type) return false;
    return true;
  });

  return (
    <div>
      <h2>Transactions</h2>
      <motion.button className="btn btn-primary mb-2" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={() => { setShowForm(true); setEditTxn(null); }}>Add Transaction</motion.button>
      <TransactionFilter setFilter={setFilter} />
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredTxns.map(txn => (
                <motion.tr key={txn.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} whileHover={{ scale: 1.01, backgroundColor: '#f8f9fa' }} transition={{ duration: 0.2 }}>
                  <td>{txn.date}</td>
                  <td>{txn.type}</td>
                  <td>{txn.category}</td>
                  <td>{txn.amount}</td>
                  <td>{txn.note}</td>
                  <td>
                    <motion.button className="btn btn-sm btn-warning me-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => { setEditTxn(txn); setShowForm(true); }}>Edit</motion.button>
                    <motion.button className="btn btn-sm btn-danger" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleDelete(txn.id)}>Delete</motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {showForm && (
          <TransactionForm
            onSave={editTxn ? handleEdit : handleAdd}
            onCancel={() => { setShowForm(false); setEditTxn(null); }}
            initialData={editTxn}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionsList;
