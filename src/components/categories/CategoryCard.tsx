import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, Badge } from '../ui';
import type { Category } from '../../types';
import { formatCurrency } from '../../utils/format';
import { useState } from 'react';

interface CategoryCardProps {
  category: Category;
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

export default function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Card className="relative hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Icon and Color */}
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{
                backgroundColor: category.color || '#E5E7EB',
              }}
            >
              {category.icon || '📁'}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{category.name}</h3>
              <Badge variant="secondary" className={categoryTypeColors[category.type]}>
                {categoryTypeLabels[category.type]}
              </Badge>
            </div>
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
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
                      onEdit(category);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
                        onDelete(category.id);
                      }
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

        {/* Monthly Budget */}
        {category.monthly_budget !== null && category.monthly_budget > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Presupuesto mensual</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(category.monthly_budget)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
