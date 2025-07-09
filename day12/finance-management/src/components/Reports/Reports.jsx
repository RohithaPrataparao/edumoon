import React, { useState } from 'react';
import IncomeVsExpensesReport from './IncomeVsExpensesReport';
import CategorySpendingReport from './CategorySpendingReport';
import BudgetPerformanceReport from './BudgetPerformanceReport';
import GoalProgressReport from './GoalProgressReport';
import RecurringTransactionsReport from './RecurringTransactionsReport';
import CashFlowReport from './CashFlowReport';
import SavingsRateReport from './SavingsRateReport';
import CustomPeriodComparisonReport from './CustomPeriodComparisonReport';
import TransactionHistoryReport from './TransactionHistoryReport';

const TABS = [
  { label: 'Income vs. Expenses', component: <IncomeVsExpensesReport /> },
  { label: 'Category Spending', component: <CategorySpendingReport /> },
  { label: 'Budget Performance', component: <BudgetPerformanceReport /> },
  { label: 'Goal Progress', component: <GoalProgressReport /> },
  { label: 'Recurring Transactions', component: <RecurringTransactionsReport /> },
  { label: 'Cash Flow', component: <CashFlowReport /> },
  { label: 'Savings Rate', component: <SavingsRateReport /> },
  { label: 'Custom Comparison', component: <CustomPeriodComparisonReport /> },
  { label: 'Transaction History', component: <TransactionHistoryReport /> },
];

const Reports = () => {
  const [tab, setTab] = useState(0);
  return (
    <div>
      <h2>Reports</h2>
      <ul className="nav nav-tabs mb-3">
        {TABS.map((t, idx) => (
          <li className="nav-item" key={t.label}>
            <button className={`nav-link${tab === idx ? ' active' : ''}`} onClick={() => setTab(idx)}>{t.label}</button>
          </li>
        ))}
      </ul>
      <div>{TABS[tab].component}</div>
    </div>
  );
};

export default Reports;
