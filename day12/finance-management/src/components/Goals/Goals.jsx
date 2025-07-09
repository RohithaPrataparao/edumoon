import React, { useState, useEffect } from 'react';
import GoalForm from './GoalForm';
import GoalContributionForm from './GoalContributionForm';
import { motion, AnimatePresence } from 'framer-motion';

const GOALS_KEY = 'financeapp_goals';
const CONTRIBUTIONS_KEY = 'financeapp_goal_contributions';
const TRANSACTIONS_KEY = 'financeapp_transactions';

const getGoals = () => {
  const owner = localStorage.getItem('financeapp_data_owner');
  return JSON.parse(localStorage.getItem(`financeapp_goals_${owner}`)) || [];
};
const saveGoals = (goals) => {
  const owner = localStorage.getItem('financeapp_data_owner');
  localStorage.setItem(`financeapp_goals_${owner}`, JSON.stringify(goals));
};
const getContributions = () => {
  const owner = localStorage.getItem('financeapp_data_owner');
  return JSON.parse(localStorage.getItem(`financeapp_goal_contributions_${owner}`)) || [];
};
const saveContributions = (contributions) => {
  const owner = localStorage.getItem('financeapp_data_owner');
  localStorage.setItem(`financeapp_goal_contributions_${owner}`, JSON.stringify(contributions));
};
const getTransactions = () => {
  const owner = localStorage.getItem('financeapp_data_owner');
  return JSON.parse(localStorage.getItem(`financeapp_transactions_${owner}`)) || [];
};
const saveTransactions = (transactions) => {
  const owner = localStorage.getItem('financeapp_data_owner');
  localStorage.setItem(`financeapp_transactions_${owner}`, JSON.stringify(transactions));
};

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [showContributionForm, setShowContributionForm] = useState(false);
  const [contributions, setContributions] = useState([]);
  const [editContributionIdx, setEditContributionIdx] = useState(null);

  useEffect(() => {
    setGoals(getGoals());
    setTransactions(getTransactions());
    setContributions(getContributions());
  }, []);

  const handleAdd = (goal) => {
    const newGoals = [...goals, goal];
    setGoals(newGoals);
    saveGoals(newGoals);
    setShowForm(false);
  };

  const handleEdit = (goal) => {
    const newGoals = goals.map(g => g.id === goal.id ? goal : g);
    setGoals(newGoals);
    saveGoals(newGoals);
    setEditGoal(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const newGoals = goals.filter(g => g.id !== id);
    setGoals(newGoals);
    saveGoals(newGoals);
  };

  // Calculate progress for each goal based on goal contributions in contributions
  const getGoalProgress = (goalName, targetAmount) => {
    const total = contributions
      .filter(c => c.goalName === goalName)
      .reduce((sum, c) => sum + Number(c.amount), 0);
    return {
      total,
      percent: Math.min((total / targetAmount) * 100, 100)
    };
  };

  const handleAddContribution = (contribution) => {
    const newContributions = [...contributions, contribution];
    setContributions(newContributions);
    saveContributions(newContributions);
    setShowContributionForm(false);
  };

  const handleEditContribution = (contribution, idx) => {
    setShowContributionForm(true);
    setEditContributionIdx(idx);
  };

  const handleSaveContribution = (contribution) => {
    let newContributions;
    if (editContributionIdx !== null) {
      newContributions = contributions.map((c, idx) => idx === editContributionIdx ? contribution : c);
    } else {
      newContributions = [...contributions, contribution];
    }
    setContributions(newContributions);
    saveContributions(newContributions);
    setShowContributionForm(false);
    setEditContributionIdx(null);
  };

  const handleDeleteContribution = (idx) => {
    const newContributions = contributions.filter((_, i) => i !== idx);
    setContributions(newContributions);
    saveContributions(newContributions);
  };

  return (
    <div>
      <motion.h2 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>Goals</motion.h2>
      <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="btn btn-primary mb-2 neu-btn" onClick={() => { setShowForm(true); setEditGoal(null); }}>Add Goal</motion.button>
      <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="btn btn-success mb-2 ms-2 neu-btn" onClick={() => setShowContributionForm(true)}>Add Goal Contribution</motion.button>
      <div className="table-responsive">
        <table className="table table-bordered neu-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Target Amount</th>
              <th>Saved (Goal Contributions)</th>
              <th>Progress</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {goals.map(goal => {
              const progress = getGoalProgress(goal.name, goal.targetAmount);
              return (
                <motion.tr key={goal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.01, backgroundColor: '#f8f9fa' }} transition={{ duration: 0.2 }}>
                  <td>{goal.name}</td>
                  <td>{goal.targetAmount}</td>
                  <td>{progress.total}</td>
                  <td>
                    <motion.div className="progress" initial={{ scaleX: 0.8 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4 }}>
                      <div className="progress-bar bg-success" role="progressbar" style={{ width: progress.percent + '%' }}>
                        {progress.percent.toFixed(0)}%
                      </div>
                    </motion.div>
                  </td>
                  <td>{goal.deadline}</td>
                  <td>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="btn btn-sm btn-warning me-2" onClick={() => { setEditGoal(goal); setShowForm(true); }}>Edit</motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="btn btn-sm btn-danger" onClick={() => handleDelete(goal.id)}>Delete</motion.button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <h4 className="mt-4">Goal Contributions</h4>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Goal Name</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contributions.map((contrib, idx) => (
              <tr key={idx}>
                <td>{contrib.goalName}</td>
                <td>{contrib.amount}</td>
                <td>{contrib.date}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => { setEditContributionIdx(idx); setShowContributionForm(true); }}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteContribution(idx)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {showForm && (
          <GoalForm
            onSave={editGoal ? handleEdit : handleAdd}
            onCancel={() => { setShowForm(false); setEditGoal(null); }}
            initialData={editGoal}
          />
        )}
        {showContributionForm && (
          <GoalContributionForm
            onSave={handleSaveContribution}
            onCancel={() => { setShowContributionForm(false); setEditContributionIdx(null); }}
            initialData={editContributionIdx !== null ? contributions[editContributionIdx] : undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Goals;
