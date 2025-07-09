import React, { useEffect, useState } from 'react';

const CustomPeriodComparisonReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [period1, setPeriod1] = useState({ from: '', to: '' });
  const [period2, setPeriod2] = useState({ from: '', to: '' });
  const [result, setResult] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('financeapp_user'));
    if (!user) return;
    const allTransactions = JSON.parse(localStorage.getItem('financeapp_transactions') || '[]');
    setTransactions(allTransactions.filter(t => t.userId === user.id));
  }, []);

  const calcTotals = (from, to) => {
    const filtered = transactions.filter(t => t.date >= from && t.date <= to);
    const income = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
    return { income, expense };
  };

  const handleCompare = () => {
    const totals1 = calcTotals(period1.from, period1.to);
    const totals2 = calcTotals(period2.from, period2.to);
    setResult({ totals1, totals2 });
  };

  return (
    <div>
      <h4>Custom Period Comparison</h4>
      <div className="row mb-3">
        <div className="col">
          <label>Period 1 From: <input type="date" value={period1.from} onChange={e => setPeriod1({ ...period1, from: e.target.value })} className="form-control" /></label>
        </div>
        <div className="col">
          <label>Period 1 To: <input type="date" value={period1.to} onChange={e => setPeriod1({ ...period1, to: e.target.value })} className="form-control" /></label>
        </div>
        <div className="col">
          <label>Period 2 From: <input type="date" value={period2.from} onChange={e => setPeriod2({ ...period2, from: e.target.value })} className="form-control" /></label>
        </div>
        <div className="col">
          <label>Period 2 To: <input type="date" value={period2.to} onChange={e => setPeriod2({ ...period2, to: e.target.value })} className="form-control" /></label>
        </div>
        <div className="col-auto d-flex align-items-end">
          <button className="btn btn-primary" onClick={handleCompare}>Compare</button>
        </div>
      </div>
      {result && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th></th>
              <th>Income</th>
              <th>Expenses</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Period 1</td>
              <td className="text-success">₹{result.totals1.income.toLocaleString()}</td>
              <td className="text-danger">₹{result.totals1.expense.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Period 2</td>
              <td className="text-success">₹{result.totals2.income.toLocaleString()}</td>
              <td className="text-danger">₹{result.totals2.expense.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomPeriodComparisonReport;
