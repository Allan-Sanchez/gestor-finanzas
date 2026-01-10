import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import { useAccounts } from '../hooks/useAccounts';
import IncomeExpenseReport from '../components/reports/IncomeExpenseReport';
import CategoryReport from '../components/reports/CategoryReport';
import MonthlyComparisonReport from '../components/reports/MonthlyComparisonReport';
import AccountBalanceReport from '../components/reports/AccountBalanceReport';

export default function ReportsPage() {
  const { user } = useAuth();
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions(user?.id);
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts(user?.id);

  const [activeTab, setActiveTab] = useState<'income-expense' | 'categories' | 'comparison' | 'accounts'>('income-expense');

  if (transactionsLoading || accountsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Cargando reportes...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'income-expense' as const, label: 'Ingresos vs Gastos', icon: FileText },
    { id: 'categories' as const, label: 'Por Categorías', icon: FileText },
    { id: 'comparison' as const, label: 'Comparativa Mensual', icon: FileText },
    { id: 'accounts' as const, label: 'Estado de Cuentas', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Reportes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Análisis detallados de tus finanzas</p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Download className="w-5 h-5" />
          Exportar
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Report Content */}
      <div className="print:shadow-none">
        {activeTab === 'income-expense' && (
          <IncomeExpenseReport transactions={transactions} />
        )}
        {activeTab === 'categories' && (
          <CategoryReport transactions={transactions as any} />
        )}
        {activeTab === 'comparison' && (
          <MonthlyComparisonReport transactions={transactions} />
        )}
        {activeTab === 'accounts' && (
          <AccountBalanceReport accounts={accounts} transactions={transactions} />
        )}
      </div>

      {/* No Data Message */}
      {transactions.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800 font-medium">No hay transacciones registradas</p>
          <p className="text-yellow-600 text-sm mt-1">
            Comienza agregando transacciones para ver reportes detallados
          </p>
        </div>
      )}
    </div>
  );
}
