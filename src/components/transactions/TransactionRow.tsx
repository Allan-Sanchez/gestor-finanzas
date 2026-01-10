import { MoreVertical, Edit2, Trash2, TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';
import { Badge, ConfirmDialog } from '../ui';
import type { TransactionWithRelations } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { useState } from 'react';

interface TransactionRowProps {
  transaction: TransactionWithRelations;
  onEdit: (transaction: TransactionWithRelations) => void;
  onDelete: (id: string) => void;
}

const transactionTypeIcons = {
  income: TrendingUp,
  expense: TrendingDown,
  transfer: ArrowRightLeft,
};

const transactionTypeColors = {
  income: 'text-green-600',
  expense: 'text-red-600',
  transfer: 'text-blue-600',
};

const statusColors = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  paid: 'Pagado',
  pending: 'Pendiente',
  cancelled: 'Cancelado',
};

export default function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const Icon = transactionTypeIcons[transaction.type];

  return (
    <tr className="hover:bg-gray-50 dark:bg-gray-700 transition-colors">
      {/* Date */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {formatDate(transaction.date)}
      </td>

      {/* Type & Description */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-green-100' : transaction.type === 'expense' ? 'bg-red-100' : 'bg-blue-100'}`}>
            <Icon className={`w-5 h-5 ${transactionTypeColors[transaction.type]}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.description}</p>
            {transaction.categories && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs" style={{ color: transaction.categories.color || '#6B7280' }}>
                  {transaction.categories.icon}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{transaction.categories.name}</span>
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Account */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
        {transaction.accounts.name}
      </td>

      {/* Amount */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
        <span className={transactionTypeColors[transaction.type]}>
          {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
          {formatCurrency(transaction.amount)}
        </span>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant="secondary" className={statusColors[transaction.status]}>
          {statusLabels[transaction.status]}
        </Badge>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-gray-100 dark:bg-gray-700 rounded-lg transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-48 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
              <button
                onClick={() => {
                  onEdit(transaction);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-700 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => {
                  setShowDeleteDialog(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </>
        )}

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={() => onDelete(transaction.id)}
          title="Eliminar Transacción"
          message={`¿Estás seguro de que deseas eliminar la transacción "${transaction.description}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="danger"
        />
      </td>
    </tr>
  );
}
