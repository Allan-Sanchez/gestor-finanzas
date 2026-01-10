import { ArrowUpRight, ArrowDownRight, ArrowRightLeft, Edit, Trash2 } from 'lucide-react';
import type { TransactionWithRelations } from '../../types';
import { useState } from 'react';
import { ConfirmDialog } from '../ui';

interface MobileTransactionListProps {
  transactions: TransactionWithRelations[];
  onEdit: (transaction: TransactionWithRelations) => void;
  onDelete: (id: string) => void;
}

export default function MobileTransactionList({ transactions, onEdit, onDelete }: MobileTransactionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const transactionToDelete = transactions.find(t => t.id === deletingId);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowUpRight className="w-5 h-5" />;
      case 'expense':
        return <ArrowDownRight className="w-5 h-5" />;
      case 'transfer':
        return <ArrowRightLeft className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'expense':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'transfer':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No hay transacciones para mostrar</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm active:shadow-md transition-shadow"
        >
          {/* Header Row */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(transaction.type)}`}>
                {transaction.categories ? (
                  <span className="text-xl">{transaction.categories.icon}</span>
                ) : (
                  getTypeIcon(transaction.type)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {transaction.description}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {transaction.categories?.name || 'Sin categoría'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${
                transaction.type === 'income' ? 'text-green-600 dark:text-green-400' :
                transaction.type === 'expense' ? 'text-red-600 dark:text-red-400' :
                'text-blue-600 dark:text-blue-400'
              }`}>
                {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                Q{transaction.amount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Details Row */}
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Fecha:</span>
                <span className="ml-1 text-gray-900 dark:text-white">
                  {new Date(transaction.date).toLocaleDateString('es-GT', {
                    day: '2-digit',
                    month: 'short'
                  })}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Cuenta:</span>
                <span className="ml-1 text-gray-900 dark:text-white truncate max-w-[120px] inline-block align-bottom">
                  {transaction.accounts.name}
                </span>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
              {getStatusLabel(transaction.status)}
            </span>
          </div>

          {/* Actions Row */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => onEdit(transaction)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 active:bg-blue-200 dark:active:bg-blue-900/70 transition-colors min-h-[44px]"
            >
              <Edit className="w-4 h-4" />
              <span className="text-sm font-medium">Editar</span>
            </button>
            <button
              onClick={() => setDeletingId(transaction.id)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 active:bg-red-200 dark:active:bg-red-900/70 transition-colors min-h-[44px]"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium">Eliminar</span>
            </button>
          </div>
        </div>
      ))}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) {
            onDelete(deletingId);
            setDeletingId(null);
          }
        }}
        title="Eliminar Transacción"
        message={`¿Estás seguro de que deseas eliminar la transacción "${transactionToDelete?.description}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
