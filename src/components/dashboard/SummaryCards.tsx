import { TrendingUp, TrendingDown, Wallet, PiggyBank, CreditCard, AlertCircle } from 'lucide-react';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalBudget: number;
  totalSpent: number;
  accountsBalance: number;
}

export default function SummaryCards({
  totalIncome,
  totalExpense,
  balance,
  totalBudget,
  totalSpent,
  accountsBalance
}: SummaryCardsProps) {
  const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const isOverBudget = budgetPercentage > 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Total Income */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Ingresos del Mes</span>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Q{totalIncome.toFixed(2)}</p>
        <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          Ingresos
        </p>
      </div>

      {/* Total Expense */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Gastos del Mes</span>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Q{totalExpense.toFixed(2)}</p>
        <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
          <TrendingDown className="w-4 h-4" />
          Egresos
        </p>
      </div>

      {/* Balance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Balance del Mes</span>
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
            balance >= 0 ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-orange-100 dark:bg-orange-900/30'
          }`}>
            <Wallet className={`w-4 h-4 sm:w-5 sm:h-5 ${balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`} />
          </div>
        </div>
        <p className={`text-2xl sm:text-3xl font-bold ${balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
          Q{balance.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {balance >= 0 ? 'Superávit' : 'Déficit'}
        </p>
      </div>

      {/* Budget Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Presupuesto</span>
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
            isOverBudget ? 'bg-red-100 dark:bg-red-900/30' : 'bg-purple-100 dark:bg-purple-900/30'
          }`}>
            {isOverBudget ? (
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
            ) : (
              <PiggyBank className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
            )}
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {budgetPercentage.toFixed(1)}%
        </p>
        <div className="mt-2">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Q{totalSpent.toFixed(2)}</span>
            <span>Q{totalBudget.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                isOverBudget ? 'bg-red-500' : 'bg-purple-500'
              }`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Total Accounts Balance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Balance en Cuentas</span>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Q{accountsBalance.toFixed(2)}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Total disponible
        </p>
      </div>

      {/* Savings Rate */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Tasa de Ahorro</span>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
            <PiggyBank className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0.0'}%
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {balance >= 0 ? 'Del ingreso mensual' : 'Gasto excesivo'}
        </p>
      </div>
    </div>
  );
}
