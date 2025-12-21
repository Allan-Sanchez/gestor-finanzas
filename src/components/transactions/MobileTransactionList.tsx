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
        return 'bg-green-100 text-green-700';
      case 'expense':
        return 'bg-red-100 text-red-700';
      case 'transfer':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-gray-500">No hay transacciones para mostrar</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm active:shadow-md transition-shadow"
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
                <h3 className="font-semibold text-gray-900 truncate">
                  {transaction.description}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {transaction.categories?.name || 'Sin categoría'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${
                transaction.type === 'income' ? 'text-green-600' :
                transaction.type === 'expense' ? 'text-red-600' :
                'text-blue-600'
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
                <span className="text-gray-500">Fecha:</span>
                <span className="ml-1 text-gray-900">
                  {new Date(transaction.date).toLocaleDateString('es-GT', {
                    day: '2-digit',
                    month: 'short'
                  })}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Cuenta:</span>
                <span className="ml-1 text-gray-900 truncate max-w-[120px] inline-block align-bottom">
                  {transaction.accounts.name}
                </span>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
              {getStatusLabel(transaction.status)}
            </span>
          </div>

          {/* Actions Row */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <button
              onClick={() => onEdit(transaction)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 active:bg-blue-200 transition-colors min-h-[44px]"
            >
              <Edit className="w-4 h-4" />
              <span className="text-sm font-medium">Editar</span>
            </button>
            <button
              onClick={() => setDeletingId(transaction.id)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 active:bg-red-200 transition-colors min-h-[44px]"
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
