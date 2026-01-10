import { Wallet, CreditCard, Banknote, PiggyBank, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, Badge, ConfirmDialog } from '../ui';
import type { Account } from '../../types';
import { formatCurrency } from '../../utils/format';
import { useState } from 'react';

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
}

const accountIcons = {
  cash: Banknote,
  debit: CreditCard,
  credit: CreditCard,
  savings: PiggyBank,
};

const accountTypeLabels = {
  cash: 'Efectivo',
  debit: 'Débito',
  credit: 'Crédito',
  savings: 'Ahorros',
};

const accountTypeColors = {
  cash: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
  debit: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
  credit: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400',
  savings: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
};

export default function AccountCard({ account, onEdit, onDelete }: AccountCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const Icon = accountIcons[account.type] || Wallet;

  return (
    <Card className="relative hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${accountTypeColors[account.type]}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{account.name}</h3>
              <Badge variant="secondary" className={accountTypeColors[account.type]}>
                {accountTypeLabels[account.type]}
              </Badge>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
                      onEdit(account);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteDialog(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-600 dark:text-gray-400">Balance actual</span>
            <span className={`text-2xl font-bold ${
              account.current_balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(account.current_balance)}
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-xs text-gray-500 dark:text-gray-400">Balance inicial</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatCurrency(account.initial_balance)}
            </span>
          </div>

          {account.current_balance !== account.initial_balance && (
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-gray-500 dark:text-gray-400">Diferencia</span>
              <span className={`text-sm font-medium ${
                account.current_balance - account.initial_balance >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {account.current_balance - account.initial_balance >= 0 ? '+' : ''}
                {formatCurrency(account.current_balance - account.initial_balance)}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => onDelete(account.id)}
        title="Eliminar Cuenta"
        message={`¿Estás seguro de que deseas eliminar la cuenta "${account.name}"? Esta acción no se puede deshacer y eliminará también el historial de transacciones asociadas.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </Card>
  );
}
