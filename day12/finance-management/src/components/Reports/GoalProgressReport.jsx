import React, { useEffect, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';

const GoalProgressReport = () => {
  const [goals, setGoals] = useState([]);
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('financeapp_user'));
    if (!user) return;
    const allGoals = JSON.parse(localStorage.getItem('financeapp_goals') || '[]');
    const allContributions = JSON.parse(localStorage.getItem('financeapp_goal_contributions') || '[]');
    setGoals(allGoals.filter(g => g.userId === user.id));
    setContributions(allContributions.filter(c => c.userId === user.id));
  }, []);

  const getContributed = (goalId) => {
    return contributions.filter(c => c.goalId === goalId).reduce((sum, c) => sum + Number(c.amount), 0);
  };

  return (
    <div>
      <h4>Goal Progress</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Goal</th>
            <th>Target</th>
            <th>Contributed</th>
            <th>Status</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {goals.map(goal => {
            const contributed = getContributed(goal.id);
            const percent = Math.min(100, (contributed / goal.target) * 100);
            return (
              <tr key={goal.id}>
                <td>{goal.name}</td>
                <td>₹{Number(goal.target).toLocaleString()}</td>
                <td>₹{contributed.toLocaleString()}</td>
                <td>{contributed >= goal.target ? <span className="text-success">Achieved</span> : <span className="text-primary">In Progress</span>}</td>
                <td style={{minWidth:120}}><ProgressBar now={percent} label={`${percent.toFixed(0)}%`} variant={contributed >= goal.target ? 'success' : 'info'} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GoalProgressReport;
