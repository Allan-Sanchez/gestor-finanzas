import { ArrowUpRight, ArrowDownRight, ArrowRightLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Database } from '../../types/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'] & {
  categories: {
    name: string;
    icon: string;
    color: string;
  } | null;
  accounts: {
    name: string;
  };
};

interface RecentTransactionsProps {
  transactions: Transaction[];
  limit?: number;
}

export default function RecentTransactions({ transactions, limit = 5 }: RecentTransactionsProps) {
  const recentTransactions = transactions
    .filter(t => !t.deleted_at)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowUpRight className="w-4 h-4" />;
      case 'expense':
        return <ArrowDownRight className="w-4 h-4" />;
      case 'transfer':
        return <ArrowRightLeft className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'text-green-600 bg-green-50';
      case 'expense':
        return 'text-red-600 bg-red-50';
      case 'transfer':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'income':
        return 'Ingreso';
      case 'expense':
        return 'Egreso';
      case 'transfer':
        return 'Transferencia';
      default:
        return type;
    }
  };

  if (recentTransactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Transacciones Recientes</h3>
        <div className="text-center py-12 text-gray-500">
          <p>No hay transacciones registradas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Transacciones Recientes</h3>
        <Link
          to="/transactions"
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          Ver todas
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {recentTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {/* Left side: Icon, Category/Type, Date */}
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(transaction.type)}`}>
                {transaction.categories ? (
                  <span className="text-lg">{transaction.categories.icon}</span>
                ) : (
                  getTypeIcon(transaction.type)
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {transaction.description}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500">
                    {transaction.categories?.name || getTypeLabel(transaction.type)}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('es-GT', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side: Amount */}
            <div className="text-right ml-3">
              <p className={`text-sm font-semibold ${
                transaction.type === 'income' ? 'text-green-600' :
                transaction.type === 'expense' ? 'text-red-600' :
                'text-blue-600'
              }`}>
                {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                Q{transaction.amount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {transaction.accounts.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
