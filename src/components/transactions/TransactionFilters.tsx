import { Search, Filter, X } from 'lucide-react';
import { Input, Select, Button } from '../ui';
import type { TransactionFilters, Account, Category } from '../../types';
import { useState } from 'react';

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  accounts: Account[];
  categories: Category[];
}

const transactionTypes = [
  { value: '', label: 'Todos los tipos' },
  { value: 'income', label: 'Ingresos' },
  { value: 'expense', label: 'Egresos' },
  { value: 'transfer', label: 'Transferencias' },
];

const transactionStatuses = [
  { value: '', label: 'Todos los estados' },
  { value: 'paid', label: 'Pagado' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'cancelled', label: 'Cancelado' },
];

export default function TransactionFilters({
  filters,
  onFiltersChange,
  accounts,
  categories,
}: TransactionFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm: searchTerm || undefined });
  };

  const handleTypeChange = (type: string) => {
    onFiltersChange({
      ...filters,
      type: type ? (type as 'income' | 'expense' | 'transfer') : undefined,
    });
  };

  const handleAccountChange = (accountId: string) => {
    onFiltersChange({ ...filters, accountId: accountId || undefined });
  };

  const handleCategoryChange = (categoryId: string) => {
    onFiltersChange({ ...filters, categoryId: categoryId || undefined });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status ? (status as 'paid' | 'pending' | 'cancelled') : undefined,
    });
  };

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    const newDateRange = {
      startDate: filters.dateRange?.startDate || '',
      endDate: filters.dateRange?.endDate || '',
      [field]: value,
    };

    if (!newDateRange.startDate && !newDateRange.endDate) {
      onFiltersChange({ ...filters, dateRange: undefined });
    } else {
      onFiltersChange({ ...filters, dateRange: newDateRange });
    }
  };

  const clearFilters = () => {
    onFiltersChange({});
    setShowAdvanced(false);
  };

  const hasActiveFilters =
    filters.searchTerm ||
    filters.type ||
    filters.accountId ||
    filters.categoryId ||
    filters.status ||
    filters.dateRange;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar transacciones..."
            value={filters.searchTerm || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Filter className="w-5 h-5 mr-2" />
          {showAdvanced ? 'Ocultar Filtros' : 'Más Filtros'}
        </Button>
        {hasActiveFilters && (
          <Button type="button" variant="secondary" onClick={clearFilters}>
            <X className="w-5 h-5 mr-2" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha desde
            </label>
            <Input
              type="date"
              value={filters.dateRange?.startDate || ''}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha hasta
            </label>
            <Input
              type="date"
              value={filters.dateRange?.endDate || ''}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo
            </label>
            <Select
              value={filters.type || ''}
              onChange={(e) => handleTypeChange(e.target.value)}
              options={transactionTypes}
            />
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cuenta
            </label>
            <Select
              value={filters.accountId || ''}
              onChange={(e) => handleAccountChange(e.target.value)}
              options={[
                { value: '', label: 'Todas las cuentas' },
                ...accounts.map((acc) => ({
                  value: acc.id,
                  label: acc.name,
                })),
              ]}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoría
            </label>
            <Select
              value={filters.categoryId || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
              options={[
                { value: '', label: 'Todas las categorías' },
                ...categories.map((cat) => ({
                  value: cat.id,
                  label: `${cat.icon} ${cat.name}`,
                })),
              ]}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Estado
            </label>
            <Select
              value={filters.status || ''}
              onChange={(e) => handleStatusChange(e.target.value)}
              options={transactionStatuses}
            />
          </div>
        </div>
      )}
    </div>
  );
}
