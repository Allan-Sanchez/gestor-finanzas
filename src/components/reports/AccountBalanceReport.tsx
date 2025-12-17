import { useMemo } from 'react';
import { Wallet, TrendingUp, CreditCard, PiggyBank, Banknote } from 'lucide-react';
import type { Database } from '../../types/database.types';

type Account = Database['public']['Tables']['accounts']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

interface AccountBalanceReportProps {
  accounts: Account[];
  transactions: Transaction[];
}

export default function AccountBalanceReport({ accounts, transactions }: AccountBalanceReportProps) {
  const accountStats = useMemo(() => {
    return accounts.map(account => {
      // Get transactions for this account
      const accountTransactions = transactions.filter(t =>
        t.account_id === account.id && !t.deleted_at
      );

      // Calculate total income and expense
      const totalIncome = accountTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpense = accountTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      // Calculate last 30 days activity
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

      const recentTransactions = accountTransactions.filter(t => t.date >= thirtyDaysAgoStr);
      const recentIncome = recentTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const recentExpense = recentTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const balanceChange = account.current_balance - account.initial_balance;
      const balanceChangePercentage = account.initial_balance > 0
        ? (balanceChange / account.initial_balance) * 100
        : 0;

      return {
        ...account,
        totalIncome,
        totalExpense,
        recentIncome,
        recentExpense,
        balanceChange,
        balanceChangePercentage,
        transactionCount: accountTransactions.length
      };
    }).sort((a, b) => b.current_balance - a.current_balance);
  }, [accounts, transactions]);

  const totals = useMemo(() => {
    const totalBalance = accountStats.reduce((sum, acc) => sum + acc.current_balance, 0);
    const totalInitial = accountStats.reduce((sum, acc) => sum + acc.initial_balance, 0);
    const totalChange = totalBalance - totalInitial;
    const totalChangePercentage = totalInitial > 0 ? (totalChange / totalInitial) * 100 : 0;

    return {
      totalBalance,
      totalInitial,
      totalChange,
      totalChangePercentage
    };
  }, [accountStats]);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'cash':
        return Banknote;
      case 'debit':
        return CreditCard;
      case 'credit':
        return CreditCard;
      case 'savings':
        return PiggyBank;
      default:
        return Wallet;
    }
  };

  const getAccountTypeName = (type: string) => {
    switch (type) {
      case 'cash':
        return 'Efectivo';
      case 'debit':
        return 'Débito';
      case 'credit':
        return 'Crédito';
      case 'savings':
        return 'Ahorros';
      default:
        return type;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'cash':
        return 'bg-green-100 text-green-700';
      case 'debit':
        return 'bg-blue-100 text-blue-700';
      case 'credit':
        return 'bg-purple-100 text-purple-700';
      case 'savings':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Reporte de Cuentas</h3>
        <Wallet className="w-5 h-5 text-gray-400" />
      </div>

      {/* Total Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Balance Total</p>
            <p className="text-3xl font-bold text-gray-900">Q{totals.totalBalance.toFixed(2)}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-600">Balance inicial: Q{totals.totalInitial.toFixed(2)}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${
              totals.totalChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <TrendingUp className={`w-4 h-4 ${totals.totalChange < 0 ? 'rotate-180' : ''}`} />
              <span className="text-sm font-semibold">
                {totals.totalChange >= 0 ? '+' : ''}Q{totals.totalChange.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {totals.totalChangePercentage >= 0 ? '+' : ''}{totals.totalChangePercentage.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      {accountStats.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No hay cuentas registradas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {accountStats.map((account) => {
            const Icon = getAccountIcon(account.type);

            return (
              <div key={account.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* Account Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      getAccountTypeColor(account.type)
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{account.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getAccountTypeColor(account.type)}`}>
                        {getAccountTypeName(account.type)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      Q{account.current_balance.toFixed(2)}
                    </p>
                    <div className={`text-sm font-medium ${
                      account.balanceChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {account.balanceChange >= 0 ? '+' : ''}Q{account.balanceChange.toFixed(2)}
                      {' '}({account.balanceChangePercentage >= 0 ? '+' : ''}{account.balanceChangePercentage.toFixed(1)}%)
                    </div>
                  </div>
                </div>

                {/* Account Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-xs text-gray-600 mb-1">Balance Inicial</p>
                    <p className="text-sm font-semibold text-gray-900">
                      Q{account.initial_balance.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded p-3">
                    <p className="text-xs text-green-700 mb-1">Total Ingresos</p>
                    <p className="text-sm font-semibold text-green-600">
                      Q{account.totalIncome.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded p-3">
                    <p className="text-xs text-red-700 mb-1">Total Gastos</p>
                    <p className="text-sm font-semibold text-red-600">
                      Q{account.totalExpense.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded p-3">
                    <p className="text-xs text-blue-700 mb-1">Transacciones</p>
                    <p className="text-sm font-semibold text-blue-600">
                      {account.transactionCount}
                    </p>
                  </div>
                </div>

                {/* Last 30 days activity */}
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-600 mb-2">Últimos 30 días</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-600">Ingresos:</span>
                      <span className="text-sm font-semibold text-green-600">
                        Q{account.recentIncome.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-600">Gastos:</span>
                      <span className="text-sm font-semibold text-red-600">
                        Q{account.recentExpense.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
