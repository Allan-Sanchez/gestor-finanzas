import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import type { Database } from '../../types/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];

interface MonthlyComparisonReportProps {
  transactions: Transaction[];
}

export default function MonthlyComparisonReport({ transactions }: MonthlyComparisonReportProps) {
  // Get last 12 months data
  const monthlyComparison = useMemo(() => {
    const months = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7);

      const monthTransactions = transactions.filter(t =>
        t.date.startsWith(monthKey) && !t.deleted_at
      );

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const balance = income - expense;
      const savingsRate = income > 0 ? (balance / income) * 100 : 0;

      months.push({
        monthKey,
        monthShort: date.toLocaleDateString('es-GT', { month: 'short', year: '2-digit' }),
        monthFull: date.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' }),
        income,
        expense,
        balance,
        savingsRate,
        hasData: monthTransactions.length > 0
      });
    }

    return months;
  }, [transactions]);

  // Calculate statistics
  const stats = useMemo(() => {
    const months = monthlyComparison.filter(m => m.hasData);
    if (months.length === 0) return null;

    const avgIncome = months.reduce((sum, m) => sum + m.income, 0) / months.length;
    const avgExpense = months.reduce((sum, m) => sum + m.expense, 0) / months.length;
    const avgBalance = avgIncome - avgExpense;
    const avgSavingsRate = avgIncome > 0 ? (avgBalance / avgIncome) * 100 : 0;

    // Find best and worst months
    const bestMonth = months.reduce((best, m) => m.balance > best.balance ? m : best, months[0]);
    const worstMonth = months.reduce((worst, m) => m.balance < worst.balance ? m : worst, months[0]);

    // Calculate trends
    const recentMonths = months.slice(-3);
    const olderMonths = months.slice(-6, -3);

    const recentAvgIncome = recentMonths.reduce((sum, m) => sum + m.income, 0) / recentMonths.length;
    const olderAvgIncome = olderMonths.reduce((sum, m) => sum + m.income, 0) / olderMonths.length;
    const incomeTrend = olderAvgIncome > 0 ? ((recentAvgIncome - olderAvgIncome) / olderAvgIncome) * 100 : 0;

    const recentAvgExpense = recentMonths.reduce((sum, m) => sum + m.expense, 0) / recentMonths.length;
    const olderAvgExpense = olderMonths.reduce((sum, m) => sum + m.expense, 0) / olderMonths.length;
    const expenseTrend = olderAvgExpense > 0 ? ((recentAvgExpense - olderAvgExpense) / olderAvgExpense) * 100 : 0;

    return {
      avgIncome,
      avgExpense,
      avgBalance,
      avgSavingsRate,
      bestMonth,
      worstMonth,
      incomeTrend,
      expenseTrend
    };
  }, [monthlyComparison]);

  const maxValue = Math.max(
    ...monthlyComparison.map(m => Math.max(m.income, m.expense)),
    1000
  );

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Comparativa Mensual (Últimos 12 Meses)</h3>
        <Calendar className="w-5 h-5 text-gray-400" />
      </div>

      {/* Statistics Summary */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Average Income */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-900">Ingreso Promedio</span>
              <TrendingUp className={`w-4 h-4 ${stats.incomeTrend >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <p className="text-xl font-bold text-green-600">Q{stats.avgIncome.toFixed(2)}</p>
            <p className={`text-xs mt-1 ${stats.incomeTrend >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {stats.incomeTrend >= 0 ? '+' : ''}{stats.incomeTrend.toFixed(1)}% últimos 3 meses
            </p>
          </div>

          {/* Average Expense */}
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-900">Gasto Promedio</span>
              <TrendingDown className={`w-4 h-4 ${stats.expenseTrend <= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <p className="text-xl font-bold text-red-600">Q{stats.avgExpense.toFixed(2)}</p>
            <p className={`text-xs mt-1 ${stats.expenseTrend <= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {stats.expenseTrend >= 0 ? '+' : ''}{stats.expenseTrend.toFixed(1)}% últimos 3 meses
            </p>
          </div>

          {/* Best Month */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Mejor Mes</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xl font-bold text-blue-600">Q{stats.bestMonth.balance.toFixed(2)}</p>
            <p className="text-xs text-blue-700 mt-1 capitalize">{stats.bestMonth.monthFull}</p>
          </div>

          {/* Average Savings Rate */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-900">Tasa de Ahorro</span>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xl font-bold text-purple-600">{stats.avgSavingsRate.toFixed(1)}%</p>
            <p className="text-xs text-purple-700 mt-1">Promedio mensual</p>
          </div>
        </div>
      )}

      {/* Monthly Chart */}
      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-2">
          {monthlyComparison.map((month, index) => {
            const maxHeight = 200;
            const incomeHeight = (month.income / maxValue) * maxHeight;
            const expenseHeight = (month.expense / maxValue) * maxHeight;

            return (
              <div key={index} className="flex flex-col items-center">
                {/* Bars */}
                <div className="relative w-full" style={{ height: `${maxHeight}px` }}>
                  <div className="absolute bottom-0 w-full flex gap-0.5 items-end">
                    {/* Income bar */}
                    <div
                      className="flex-1 bg-green-500 rounded-t transition-all hover:bg-green-600"
                      style={{ height: `${incomeHeight}px` }}
                      title={`Ingreso: Q${month.income.toFixed(2)}`}
                    />
                    {/* Expense bar */}
                    <div
                      className="flex-1 bg-red-500 rounded-t transition-all hover:bg-red-600"
                      style={{ height: `${expenseHeight}px` }}
                      title={`Gasto: Q${month.expense.toFixed(2)}`}
                    />
                  </div>
                </div>

                {/* Month label */}
                <div className="mt-2 text-center">
                  <p className="text-xs font-medium text-gray-700 capitalize">
                    {month.monthShort}
                  </p>
                  {month.hasData && (
                    <p className={`text-xs font-semibold mt-0.5 ${
                      month.balance >= 0 ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {month.balance >= 0 ? '+' : ''}{(month.balance / 1000).toFixed(1)}k
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span className="text-sm text-gray-600">Ingresos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span className="text-sm text-gray-600">Gastos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded" />
          <span className="text-sm text-gray-600">Balance</span>
        </div>
      </div>
    </div>
  );
}
