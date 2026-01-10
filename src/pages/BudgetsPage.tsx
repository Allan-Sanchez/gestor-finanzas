import { Plus, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useBudgets, useCreateBudget, useUpdateBudget, useDeleteBudget } from '../hooks/useBudgets';
import { useTransactions } from '../hooks/useTransactions';
import BudgetCard from '../components/budgets/BudgetCard';
import BudgetForm from '../components/budgets/BudgetForm';
import type { Database } from '../types/database.types';

type Budget = Database['public']['Tables']['budgets']['Row'] & {
  categories: {
    name: string;
    icon: string;
    color: string;
  };
};

export default function BudgetsPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | undefined>();

  const { data: budgets, isLoading } = useBudgets();
  const { data: transactions } = useTransactions();
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();

  // Get current month for filtering
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Filter budgets for current month
  const currentMonthBudgets = useMemo(() => {
    return budgets?.filter(budget => budget.month === currentMonth) || [];
  }, [budgets, currentMonth]);

  // Calculate spent amount for each budget
  const budgetsWithSpent = useMemo(() => {
    if (!currentMonthBudgets || !transactions) return [];

    return currentMonthBudgets.map(budget => {
      const spent = transactions
        .filter(t =>
          t.category_id === budget.category_id &&
          t.type === 'expense' &&
          t.date.startsWith(budget.month) &&
          !t.deleted_at
        )
        .reduce((sum, t) => sum + t.amount, 0);

      return { ...budget, spent };
    });
  }, [currentMonthBudgets, transactions]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalBudgeted = budgetsWithSpent.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = budgetsWithSpent.reduce((sum, b) => sum + b.spent, 0);
    const overBudgetCount = budgetsWithSpent.filter(b => b.spent > b.amount).length;

    return { totalBudgeted, totalSpent, overBudgetCount };
  }, [budgetsWithSpent]);

  const handleSubmit = (data: Partial<Budget>) => {
    if (selectedBudget) {
      updateBudget.mutate(
        { id: selectedBudget.id, data },
        {
          onSuccess: () => {
            setShowForm(false);
            setSelectedBudget(undefined);
          },
        }
      );
    } else {
      createBudget.mutate(data as any, {
        onSuccess: () => {
          setShowForm(false);
        },
      });
    }
  };

  const handleEdit = (budget: Budget) => {
    setSelectedBudget(budget);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteBudget.mutate(id);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedBudget(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Cargando presupuestos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Presupuestos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Define y monitorea tus presupuestos mensuales</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Nuevo Presupuesto
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Budgeted */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Presupuestado</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            Q{summary.totalBudgeted.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {currentMonthBudgets.length} {currentMonthBudgets.length === 1 ? 'presupuesto' : 'presupuestos'}
          </p>
        </div>

        {/* Total Spent */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Gastado</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            Q{summary.totalSpent.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {summary.totalBudgeted > 0
              ? `${((summary.totalSpent / summary.totalBudgeted) * 100).toFixed(1)}% del total`
              : 'Sin presupuestos'
            }
          </p>
        </div>

        {/* Current Month */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Mes Actual</span>
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {new Date().toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {summary.overBudgetCount > 0
              ? `${summary.overBudgetCount} sobre presupuesto`
              : 'Todo en orden'
            }
          </p>
        </div>
      </div>

      {/* Budgets List */}
      {budgetsWithSpent.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No hay presupuestos definidos
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Comienza creando un presupuesto para el mes actual
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Crear Primer Presupuesto
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Presupuestos de {new Date().toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgetsWithSpent.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                spent={budget.spent}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Budget Form Modal */}
      {showForm && (
        <BudgetForm
          budget={selectedBudget}
          onSubmit={handleSubmit}
          onClose={handleCloseForm}
          isLoading={createBudget.isPending || updateBudget.isPending}
        />
      )}
    </div>
  );
}
