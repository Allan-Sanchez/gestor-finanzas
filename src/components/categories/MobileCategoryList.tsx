import { Edit2, Trash2 } from 'lucide-react';
import type { Category } from '../../types';
import { formatCurrency } from '../../utils/format';

interface MobileCategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

const categoryTypeLabels = {
  income: 'Ingreso',
  expense: 'Egreso',
};

const categoryTypeColors = {
  income: 'bg-green-100 text-green-800',
  expense: 'bg-red-100 text-red-800',
};

export default function MobileCategoryList({ categories, onEdit, onDelete }: MobileCategoryListProps) {
  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white rounded-lg shadow p-4 border border-gray-200"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
              style={{
                backgroundColor: category.color || '#E5E7EB',
              }}
            >
              {category.icon || '📁'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${categoryTypeColors[category.type]}`}>
                {categoryTypeLabels[category.type]}
              </span>
            </div>
          </div>

          {/* Monthly Budget */}
          {category.monthly_budget !== null && category.monthly_budget > 0 && (
            <div className="mb-3 pb-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Presupuesto mensual</span>
                <span className="text-base font-semibold text-gray-900">
                  {formatCurrency(category.monthly_budget)}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(category)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 active:bg-blue-200 transition-colors min-h-[44px]"
            >
              <Edit2 className="w-4 h-4" />
              <span className="text-sm font-medium">Editar</span>
            </button>
            <button
              onClick={() => {
                if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
                  onDelete(category.id);
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 active:bg-red-200 transition-colors min-h-[44px]"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium">Eliminar</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
