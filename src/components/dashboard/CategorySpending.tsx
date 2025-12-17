import { useMemo } from 'react';
import type { Database } from '../../types/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'] & {
  categories: {
    name: string;
    icon: string;
    color: string;
  } | null;
};

interface CategorySpendingProps {
  transactions: Transaction[];
}

interface CategoryData {
  id: string;
  name: string;
  icon: string;
  color: string;
  amount: number;
  percentage: number;
}

export default function CategorySpending({ transactions }: CategorySpendingProps) {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const categoryData = useMemo(() => {
    // Filter current month expenses with categories
    const monthExpenses = transactions.filter(t =>
      t.date.startsWith(currentMonth) &&
      t.type === 'expense' &&
      t.categories &&
      !t.deleted_at
    ) as (Transaction & { categories: { name: string; icon: string; color: string } })[];

    // Group by category
    const grouped = monthExpenses.reduce((acc, t) => {
      const catId = t.category_id;
      if (!catId) return acc;

      if (!acc[catId]) {
        acc[catId] = {
          id: catId,
          name: t.categories.name,
          icon: t.categories.icon,
          color: t.categories.color,
          amount: 0
        };
      }
      acc[catId].amount += t.amount;
      return acc;
    }, {} as Record<string, Omit<CategoryData, 'percentage'>>);

    // Convert to array and calculate percentages
    const total = Object.values(grouped).reduce((sum, cat) => sum + cat.amount, 0);
    const data: CategoryData[] = Object.values(grouped)
      .map(cat => ({
        ...cat,
        percentage: total > 0 ? (cat.amount / total) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8); // Top 8 categories

    return { data, total };
  }, [transactions, currentMonth]);

  if (categoryData.data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Gastos por Categoría</h3>
        <div className="text-center py-12 text-gray-500">
          <p>No hay gastos registrados este mes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Gastos por Categoría</h3>
        <span className="text-sm text-gray-500">
          Total: Q{categoryData.total.toFixed(2)}
        </span>
      </div>

      <div className="space-y-4">
        {categoryData.data.map((category) => (
          <div key={category.id}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 flex-1">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  {category.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {category.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {category.percentage.toFixed(1)}%
                </span>
                <span className="text-sm font-semibold text-gray-900 w-24 text-right">
                  Q{category.amount.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${category.percentage}%`,
                  backgroundColor: category.color
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Show if there are more categories */}
      {categoryData.data.length >= 8 && (
        <p className="text-xs text-gray-500 text-center mt-4">
          Mostrando las 8 categorías principales
        </p>
      )}
    </div>
  );
}
