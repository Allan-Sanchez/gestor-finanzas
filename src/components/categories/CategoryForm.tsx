import { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '../ui';
import type { Category, CategoryInsert, CategoryUpdate } from '../../types';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryInsert | CategoryUpdate) => void;
  category?: Category | null;
  userId: string;
  isLoading?: boolean;
}

const categoryTypes = [
  { value: 'income', label: 'Ingreso' },
  { value: 'expense', label: 'Egreso' },
];

const commonIcons = [
  '🏠', '🚗', '🍔', '🛒', '💊', '🎓', '🎮', '✈️',
  '👕', '💼', '🏋️', '🎬', '📱', '💰', '🎁', '⚡',
  '🍕', '☕', '🏥', '🚌', '📚', '🎵', '💻', '🔧',
  '❤️', '🧑‍🔧', '👟', '🍺', '🏍️', '🛜', '🦷', '🛣️',
];

const commonColors = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
  '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#64748B',
];

export default function CategoryForm({
  isOpen,
  onClose,
  onSubmit,
  category,
  userId,
  isLoading = false,
}: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense',
    icon: '📁',
    color: '#3B82F6',
    monthly_budget: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        type: category.type,
        icon: category.icon || '📁',
        color: category.color || '#3B82F6',
        monthly_budget: category.monthly_budget?.toString() || '',
      });
    } else {
      setFormData({
        name: '',
        type: 'expense',
        icon: '📁',
        color: '#3B82F6',
        monthly_budget: '',
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData.monthly_budget) {
      const budget = parseFloat(formData.monthly_budget);
      if (isNaN(budget) || budget < 0) {
        newErrors.monthly_budget = 'El presupuesto debe ser un número válido mayor o igual a 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const budget = formData.monthly_budget ? parseFloat(formData.monthly_budget) : null;

    if (category) {
      // Actualizar categoría existente
      const updates: CategoryUpdate = {
        name: formData.name,
        type: formData.type,
        icon: formData.icon,
        color: formData.color,
        monthly_budget: budget,
      };
      onSubmit(updates);
    } else {
      // Crear nueva categoría
      const newCategory: CategoryInsert = {
        user_id: userId,
        name: formData.name,
        type: formData.type,
        icon: formData.icon,
        color: formData.color,
        monthly_budget: budget,
      };
      onSubmit(newCategory);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Editar Categoría' : 'Nueva Categoría'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre de la categoría *
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Alimentación, Transporte, Salario"
              error={errors.name}
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de categoría *
            </label>
            <Select
              id="type"
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as 'income' | 'expense',
                })
              }
              options={categoryTypes}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icono
            </label>
            <div className="grid grid-cols-8 gap-2">
              {commonIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                    formData.icon === icon
                      ? 'bg-blue-100 ring-2 ring-blue-500'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <Input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="O escribe tu propio emoji"
              className="mt-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="grid grid-cols-9 gap-2">
              {commonColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <Input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="mt-2 h-10"
            />
          </div>

          {formData.type === 'expense' && (
            <div>
              <label
                htmlFor="monthly_budget"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Presupuesto mensual (opcional)
              </label>
              <Input
                id="monthly_budget"
                type="number"
                step="0.01"
                value={formData.monthly_budget}
                onChange={(e) =>
                  setFormData({ ...formData, monthly_budget: e.target.value })
                }
                placeholder="0.00"
                error={errors.monthly_budget}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Define un límite mensual para esta categoría de gasto
              </p>
            </div>
          )}

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Vista previa:</p>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mx-auto"
              style={{ backgroundColor: formData.color }}
            >
              {formData.icon}
            </div>
            <p className="text-center mt-2 font-medium text-gray-900 dark:text-white">{formData.name || 'Nombre'}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Guardando...' : category ? 'Actualizar' : 'Crear Categoría'}
            </Button>
          </div>
        </form>
    </Modal>
  );
}
