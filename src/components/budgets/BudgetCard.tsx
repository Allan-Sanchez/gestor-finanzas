import { MoreVertical, Edit, Trash2, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import type { Database } from '../../types/database.types';
import { ConfirmDialog } from '../ui';

type Budget = Database['public']['Tables']['budgets']['Row'] & {
  categories: {
    name: string;
    icon: string;
    color: string;
  };
};

interface BudgetCardProps {
  budget: Budget;
  spent: number;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export default function BudgetCard({ budget, spent, onEdit, onDelete }: BudgetCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const percentage = (spent / budget.amount) * 100;
  const remaining = budget.amount - spent;
  const isOverBudget = spent > budget.amount;
  const isNearLimit = percentage >= 80 && !isOverBudget;

  const getProgressColor = () => {
    if (isOverBudget) return 'bg-red-500';
    if (isNearLimit) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusIcon = () => {
    if (isOverBudget) return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (isNearLimit) return <TrendingUp className="w-5 h-5 text-yellow-500" />;
    return <TrendingDown className="w-5 h-5 text-green-500" />;
  };

  const getStatusText = () => {
    if (isOverBudget) return 'Sobre presupuesto';
    if (isNearLimit) return 'Cerca del límite';
    return 'Dentro del presupuesto';
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${budget.categories.color}20` }}
          >
            {budget.categories.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{budget.categories.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(budget.month).toLocaleDateString('es-GT', {
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 dark:bg-gray-700 rounded"
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
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
                    onEdit(budget);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-700 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(true);
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
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Q{spent.toFixed(2)} / Q{budget.amount.toFixed(2)}
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.min(percentage, 100).toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all ${getProgressColor()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Status and Remaining */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {getStatusText()}
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Restante</p>
          <p className={`text-lg font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
            Q{remaining.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => onDelete(budget.id)}
        title="Eliminar Presupuesto"
        message={`¿Estás seguro de que deseas eliminar el presupuesto de "${budget.categories.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
