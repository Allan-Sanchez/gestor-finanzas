import { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import { useAccounts } from '../hooks/useAccounts';
import { useBudgets } from '../hooks/useBudgets';
import SummaryCards from '../components/dashboard/SummaryCards';
import MonthlyTrends from '../components/dashboard/MonthlyTrends';
import CategorySpending from '../components/dashboard/CategorySpending';
import RecentTransactions from '../components/dashboard/RecentTransactions';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions(user?.id);
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts(user?.id);
  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets(user?.id);

  // Calculate current month statistics
  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthlyStats = useMemo(() => {
    const monthTransactions = transactions.filter(
      t => t.date.startsWith(currentMonth) && !t.deleted_at
    );

    const totalIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, balance };
  }, [transactions, currentMonth]);

  // Calculate budget statistics
  const budgetStats = useMemo(() => {
    const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);
    const totalBudget = currentMonthBudgets.reduce((sum, b) => sum + b.amount, 0);

    const totalSpent = transactions
      .filter(t =>
        t.date.startsWith(currentMonth) &&
        t.type === 'expense' &&
        !t.deleted_at
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return { totalBudget, totalSpent };
  }, [budgets, transactions, currentMonth]);

  // Calculate total accounts balance
  const accountsBalance = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + acc.current_balance, 0);
  }, [accounts]);

  if (transactionsLoading || accountsLoading || budgetsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Resumen general de tus finanzas - {new Date().toLocaleDateString('es-GT', {
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </div>

      {/* Summary Cards */}
      <SummaryCards
        totalIncome={monthlyStats.totalIncome}
        totalExpense={monthlyStats.totalExpense}
        balance={monthlyStats.balance}
        totalBudget={budgetStats.totalBudget}
        totalSpent={budgetStats.totalSpent}
        accountsBalance={accountsBalance}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyTrends transactions={transactions} />
        <CategorySpending transactions={transactions as any} />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={transactions as any} limit={10} />
    </div>
  );
}
