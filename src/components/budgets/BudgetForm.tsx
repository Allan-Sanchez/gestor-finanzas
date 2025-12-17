import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCategories } from '../../hooks/useCategories';
import type { Database } from '../../types/database.types';

type Budget = Database['public']['Tables']['budgets']['Row'];

interface BudgetFormProps {
  budget?: Budget;
  onSubmit: (data: Partial<Budget>) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function BudgetForm({ budget, onSubmit, onClose, isLoading }: BudgetFormProps) {
  const { data: categories } = useCategories();

  // Filter only expense categories
  const expenseCategories = categories?.filter(cat => cat.type === 'expense') || [];

  const [formData, setFormData] = useState({
    category_id: budget?.category_id || '',
    month: budget?.month || new Date().toISOString().slice(0, 7), // YYYY-MM format
    amount: budget?.amount?.toString() || '',
    alert_percentage: budget?.alert_percentage?.toString() || '80',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (budget) {
      setFormData({
        category_id: budget.category_id,
        month: budget.month,
        amount: budget.amount.toString(),
        alert_percentage: budget.alert_percentage?.toString() || '80',
      });
    }
  }, [budget]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category_id) {
      newErrors.category_id = 'La categoría es requerida';
    }

    if (!formData.month) {
      newErrors.month = 'El mes es requerido';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }

    if (formData.alert_percentage) {
      const percentage = parseFloat(formData.alert_percentage);
      if (percentage < 0 || percentage > 100) {
        newErrors.alert_percentage = 'El porcentaje debe estar entre 0 y 100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      category_id: formData.category_id,
      month: formData.month,
      amount: parseFloat(formData.amount),
      alert_percentage: formData.alert_percentage ? parseFloat(formData.alert_percentage) : 80,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {budget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría *
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => handleChange('category_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.category_id ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isLoading || !!budget} // Can't change category when editing
            >
              <option value="">Seleccionar categoría</option>
              {expenseCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
            )}
            {expenseCategories.length === 0 && (
              <p className="mt-1 text-sm text-yellow-600">
                No hay categorías de egreso disponibles. Crea una primero.
              </p>
            )}
          </div>

          {/* Month */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mes *
            </label>
            <input
              type="month"
              value={formData.month}
              onChange={(e) => handleChange('month', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.month ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isLoading || !!budget} // Can't change month when editing
            />
            {errors.month && (
              <p className="mt-1 text-sm text-red-600">{errors.month}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto Presupuestado *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">Q</span>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.amount ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Alert Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alerta al alcanzar (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={formData.alert_percentage}
              onChange={(e) => handleChange('alert_percentage', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.alert_percentage ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="80"
              disabled={isLoading}
            />
            {errors.alert_percentage && (
              <p className="mt-1 text-sm text-red-600">{errors.alert_percentage}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Recibirás una alerta visual cuando gastes este porcentaje del presupuesto
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : budget ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
