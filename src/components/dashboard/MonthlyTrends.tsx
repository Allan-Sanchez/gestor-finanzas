import { useMemo } from 'react';
import type { Database } from '../../types/database.types';
import { useIsMobile } from '../../hooks/useIsMobile';

type Transaction = Database['public']['Tables']['transactions']['Row'];

interface MonthlyTrendsProps {
  transactions: Transaction[];
}

interface MonthData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export default function MonthlyTrends({ transactions }: MonthlyTrendsProps) {
  const isMobile = useIsMobile();

  // Get last 6 months data (or 3 on mobile)
  const monthlyData = useMemo(() => {
    const monthsToShow = isMobile ? 3 : 6;
    const lastMonths: MonthData[] = [];
    const now = new Date();

    for (let i = monthsToShow - 1; i >= 0; i--) {
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

      lastMonths.push({
        month: date.toLocaleDateString('es-GT', { month: 'short' }),
        income,
        expense,
        balance: income - expense
      });
    }

    return lastMonths;
  }, [transactions, isMobile]);

  // Find max value for scaling
  const maxValue = useMemo(() => {
    return Math.max(
      ...monthlyData.map(m => Math.max(m.income, m.expense)),
      1000 // Minimum scale
    );
  }, [monthlyData]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
        Tendencias de los Últimos {isMobile ? '3' : '6'} Meses
      </h3>

      <div className="space-y-4 sm:space-y-6">
        {monthlyData.map((data, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize w-16">
                {data.month}
              </span>
              <div className="flex-1 mx-4 space-y-1">
                {/* Income bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{ width: `${(data.income / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-24 text-right">
                    Q{data.income.toFixed(0)}
                  </span>
                </div>
                {/* Expense bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full transition-all"
                      style={{ width: `${(data.expense / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-24 text-right">
                    Q{data.expense.toFixed(0)}
                  </span>
                </div>
              </div>
              <div className={`text-sm font-semibold w-24 text-right ${
                data.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'
              }`}>
                {data.balance >= 0 ? '+' : ''}Q{data.balance.toFixed(0)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
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
