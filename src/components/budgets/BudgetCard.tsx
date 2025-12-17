import { MoreVertical, Edit, Trash2, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import type { Database } from '../../types/database.types';

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

  const handleDelete = () => {
    onDelete(budget.id);
    setShowDeleteConfirm(false);
    setShowMenu(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
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
            <h3 className="font-semibold text-gray-900">{budget.categories.name}</h3>
            <p className="text-sm text-gray-500">
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
            className="p-1 hover:bg-gray-100 rounded"
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button
                  onClick={() => {
                    onEdit(budget);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
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
          <span className="text-sm font-medium text-gray-700">
            Q{spent.toFixed(2)} / Q{budget.amount.toFixed(2)}
          </span>
          <span className="text-sm font-medium text-gray-700">
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
          <span className="text-sm font-medium text-gray-700">
            {getStatusText()}
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Restante</p>
          <p className={`text-lg font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
            Q{remaining.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro de que deseas eliminar este presupuesto? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
