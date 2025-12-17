import { useMemo, useState } from 'react';
import { Calendar, TrendingDown, TrendingUp } from 'lucide-react';
import type { Database } from '../../types/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'] & {
  categories: {
    name: string;
    icon: string;
    color: string;
  } | null;
};

interface CategoryReportProps {
  transactions: Transaction[];
}

export default function CategoryReport({ transactions }: CategoryReportProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedType, setSelectedType] = useState<'expense' | 'income'>('expense');

  // Get available months from transactions
  const availableMonths = useMemo(() => {
    const months = new Set(
      transactions.map(t => t.date.slice(0, 7))
    );
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  // Calculate category data
  const categoryData = useMemo(() => {
    const monthTransactions = transactions.filter(t =>
      t.date.startsWith(selectedMonth) &&
      t.type === selectedType &&
      t.categories &&
      !t.deleted_at
    ) as (Transaction & { categories: { name: string; icon: string; color: string } })[];

    // Group by category
    const grouped = monthTransactions.reduce((acc, t) => {
      const catId = t.category_id;
      if (!catId) return acc;

      if (!acc[catId]) {
        acc[catId] = {
          id: catId,
          name: t.categories.name,
          icon: t.categories.icon,
          color: t.categories.color,
          amount: 0,
          count: 0,
          transactions: []
        };
      }
      acc[catId].amount += t.amount;
      acc[catId].count += 1;
      acc[catId].transactions.push(t);
      return acc;
    }, {} as Record<string, {
      id: string;
      name: string;
      icon: string;
      color: string;
      amount: number;
      count: number;
      transactions: Transaction[];
    }>);

    const total = Object.values(grouped).reduce((sum, cat) => sum + cat.amount, 0);

    return {
      categories: Object.values(grouped)
        .map(cat => ({
          ...cat,
          percentage: total > 0 ? (cat.amount / total) * 100 : 0,
          average: cat.amount / cat.count
        }))
        .sort((a, b) => b.amount - a.amount),
      total
    };
  }, [transactions, selectedMonth, selectedType]);

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Reporte por Categorías</h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          {/* Type selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedType('expense')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                selectedType === 'expense'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              Gastos
            </button>
            <button
              onClick={() => setSelectedType('income')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                selectedType === 'income'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              Ingresos
            </button>
          </div>

          {/* Month selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {availableMonths.map(month => (
                <option key={month} value={month}>
                  {new Date(month + '-01').toLocaleDateString('es-GT', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Total Summary */}
      <div className={`rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 ${
        selectedType === 'expense' ? 'bg-red-50' : 'bg-green-50'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs sm:text-sm font-medium ${
            selectedType === 'expense' ? 'text-red-900' : 'text-green-900'
          }`}>
            Total de {selectedType === 'expense' ? 'Gastos' : 'Ingresos'}
          </span>
          <div className="text-right">
            <p className={`text-xl sm:text-2xl font-bold ${
              selectedType === 'expense' ? 'text-red-600' : 'text-green-600'
            }`}>
              Q{categoryData.total.toFixed(2)}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              {categoryData.categories.length} {categoryData.categories.length === 1 ? 'categoría' : 'categorías'}
            </p>
          </div>
        </div>
      </div>

      {/* Categories List */}
      {categoryData.categories.length === 0 ? (
        <div className="text-center py-8 sm:py-12 text-gray-500">
          <p className="text-sm">No hay {selectedType === 'expense' ? 'gastos' : 'ingresos'} registrados en este mes</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {categoryData.categories.map((category) => (
            <div key={category.id} className="border rounded-lg p-3 sm:p-4">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{category.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {category.count} {category.count === 1 ? 'transacción' : 'transacciones'}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-base sm:text-xl font-bold text-gray-900">
                    Q{category.amount.toFixed(2)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {category.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
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

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm">
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-gray-600 text-xs mb-1">Promedio por transacción</p>
                  <p className="font-semibold text-xs sm:text-sm text-gray-900">Q{category.average.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-gray-600 text-xs mb-1">Total del mes</p>
                  <p className="font-semibold text-xs sm:text-sm text-gray-900">Q{category.amount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
