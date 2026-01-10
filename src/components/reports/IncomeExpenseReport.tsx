import { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import type { Database } from '../../types/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];

interface IncomeExpenseReportProps {
  transactions: Transaction[];
}

export default function IncomeExpenseReport({ transactions }: IncomeExpenseReportProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Get available years from transactions
  const availableYears = useMemo(() => {
    const years = new Set(
      transactions.map(t => new Date(t.date).getFullYear())
    );
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  // Calculate monthly data for selected year
  const monthlyData = useMemo(() => {
    const months = [];

    for (let month = 0; month < 12; month++) {
      const monthKey = `${selectedYear}-${String(month + 1).padStart(2, '0')}`;
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

      months.push({
        month: new Date(selectedYear, month, 1).toLocaleDateString('es-GT', { month: 'short' }),
        monthFull: new Date(selectedYear, month, 1).toLocaleDateString('es-GT', { month: 'long' }),
        income,
        expense,
        balance,
        hasData: monthTransactions.length > 0
      });
    }

    return months;
  }, [transactions, selectedYear]);

  // Calculate yearly totals
  const yearlyTotals = useMemo(() => {
    const income = monthlyData.reduce((sum, m) => sum + m.income, 0);
    const expense = monthlyData.reduce((sum, m) => sum + m.expense, 0);
    const balance = income - expense;
    const avgIncome = income / 12;
    const avgExpense = expense / 12;

    return { income, expense, balance, avgIncome, avgExpense };
  }, [monthlyData]);

  const maxValue = Math.max(
    ...monthlyData.map(m => Math.max(m.income, m.expense)),
    1000
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Reporte de Ingresos vs Gastos</h3>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Yearly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-green-50 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <span className="text-xs sm:text-sm font-medium text-green-900">Ingresos Totales</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-green-600">Q{yearlyTotals.income.toFixed(2)}</p>
          <p className="text-xs text-green-700 mt-1">Promedio: Q{yearlyTotals.avgIncome.toFixed(2)}/mes</p>
        </div>

        <div className="bg-red-50 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            <span className="text-xs sm:text-sm font-medium text-red-900">Gastos Totales</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-red-600">Q{yearlyTotals.expense.toFixed(2)}</p>
          <p className="text-xs text-red-700 mt-1">Promedio: Q{yearlyTotals.avgExpense.toFixed(2)}/mes</p>
        </div>

        <div className={`rounded-lg p-3 sm:p-4 ${yearlyTotals.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={`w-4 h-4 sm:w-5 sm:h-5 ${yearlyTotals.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            <span className={`text-xs sm:text-sm font-medium ${yearlyTotals.balance >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
              Balance Anual
            </span>
          </div>
          <p className={`text-xl sm:text-2xl font-bold ${yearlyTotals.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            Q{yearlyTotals.balance.toFixed(2)}
          </p>
          <p className={`text-xs mt-1 ${yearlyTotals.balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
            {yearlyTotals.balance >= 0 ? 'Superávit' : 'Déficit'}
          </p>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Desglose Mensual</h4>
        {monthlyData.map((data, index) => (
          <div key={index} className={`${data.hasData ? '' : 'opacity-40'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize w-20">
                {data.monthFull}
              </span>
              <div className="flex-1 mx-4 space-y-1">
                {/* Income bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${(data.income / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-28 text-right">
                    Q{data.income.toFixed(2)}
                  </span>
                </div>
                {/* Expense bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-red-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${(data.expense / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-28 text-right">
                    Q{data.expense.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className={`text-sm font-semibold w-28 text-right ${
                data.balance >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`}>
                {data.balance >= 0 ? '+' : ''}Q{data.balance.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-6 pt-4 border-t">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Ingresos</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Gastos</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full" />
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Balance</span>
        </div>
      </div>
    </div>
  );
}
