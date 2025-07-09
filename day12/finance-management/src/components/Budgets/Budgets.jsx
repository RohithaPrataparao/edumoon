import React, { useState, useEffect } from 'react';
import BudgetForm from './BudgetForm';

const BUDGETS_KEY = 'financeapp_budgets';
const TRANSACTIONS_KEY = 'financeapp_transactions';

const getBudgets = () => {
  const owner = localStorage.getItem('financeapp_data_owner');
  return JSON.parse(localStorage.getItem(`${BUDGETS_KEY}_${owner}`)) || [];
};
const saveBudgets = (budgets) => {
  const owner = localStorage.getItem('financeapp_data_owner');
  localStorage.setItem(`${BUDGETS_KEY}_${owner}`, JSON.stringify(budgets));
};
const getTransactions = () => {
  const owner = localStorage.getItem('financeapp_data_owner');
  return JSON.parse(localStorage.getItem(`${TRANSACTIONS_KEY}_${owner}`)) || [];
};
const saveTransactions = (transactions) => {
  const owner = localStorage.getItem('financeapp_data_owner');
  const all = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY + '_all') || '{}');
  all[owner] = transactions;
  localStorage.setItem(TRANSACTIONS_KEY + '_all', JSON.stringify(all));
};

const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editBudget, setEditBudget] = useState(null);

  useEffect(() => {
    setBudgets(getBudgets());
    setTransactions(getTransactions());
  }, []);

  const handleAdd = (budget) => {
    const newBudgets = [...budgets, budget];
    setBudgets(newBudgets);
    saveBudgets(newBudgets);
    setShowForm(false);
  };

  const handleEdit = (budget) => {
    const newBudgets = budgets.map(b => b.id === budget.id ? budget : b);
    setBudgets(newBudgets);
    saveBudgets(newBudgets);
    setEditBudget(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const newBudgets = budgets.filter(b => b.id !== id);
    setBudgets(newBudgets);
    saveBudgets(newBudgets);
  };

  // Calculate spent per category for current month
  const spentByCategory = {};
  let overBudgetAlert = null;
  transactions.forEach(txn => {
    if (txn.type === 'expense' && txn.date.startsWith(getCurrentMonth())) {
      spentByCategory[txn.category] = (spentByCategory[txn.category] || 0) + Number(txn.amount);
    }
  });

  // Check for any over-budget or under-budget category
  const overBudgetCategories = budgets.filter(b => b.period === getCurrentMonth() && spentByCategory[b.category] > b.amount);
  const underBudgetCategories = budgets.filter(b => b.period === getCurrentMonth() && spentByCategory[b.category] <= b.amount);

  let budgetAlert = null;
  if (overBudgetCategories.length > 0) {
    budgetAlert = (
      <div className="alert alert-danger">
        <strong>Warning!</strong> You have exceeded your budget for: {overBudgetCategories.map(b => b.category).join(', ')}
      </div>
    );
  } else if (underBudgetCategories.length > 0 && budgets.filter(b => b.period === getCurrentMonth()).length > 0) {
    budgetAlert = (
      <div className="alert alert-success">
        <strong>Good job!</strong> You are within your budget for: {underBudgetCategories.map(b => b.category).join(', ')}
      </div>
    );
  }

  return (
    <div>
      <h2>Budgets</h2>
      {budgetAlert}
      <button className="btn btn-primary mb-2" onClick={() => { setShowForm(true); setEditBudget(null); }}>Add Budget</button>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Category</th>
              <th>Budgeted</th>
              <th>Spent</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.filter(b => b.period === getCurrentMonth()).map(budget => {
              const spent = spentByCategory[budget.category] || 0;
              const percent = Math.min((spent / budget.amount) * 100, 100);
              return (
                <tr key={budget.id}>
                  <td>{budget.category}</td>
                  <td>{budget.amount}</td>
                  <td>{spent}</td>
                  <td>
                    <div className="progress">
                      <div className={`progress-bar${spent > budget.amount ? ' bg-danger' : ''}`} role="progressbar" style={{ width: percent + '%' }}>
                        {percent.toFixed(0)}%
                      </div>
                    </div>
                    {spent > budget.amount && <span className="text-danger">Over budget!</span>}
                  </td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => { setEditBudget(budget); setShowForm(true); }}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(budget.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showForm && (
        <BudgetForm
          onSave={editBudget ? handleEdit : handleAdd}
          onCancel={() => { setShowForm(false); setEditBudget(null); }}
          initialData={editBudget}
        />
      )}
    </div>
  );
};

export default Budgets;
