import { useState } from 'react';
import { Download, Upload, Trash2, AlertTriangle, Database } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTransactions } from '../../hooks/useTransactions';
import { useAccounts } from '../../hooks/useAccounts';
import { useCategories } from '../../hooks/useCategories';
import { useBudgets } from '../../hooks/useBudgets';
import { supabase } from '../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

export default function DataManagement() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: transactions = [] } = useTransactions(user?.id);
  const { data: accounts = [] } = useAccounts(user?.id);
  const { data: categories = [] } = useCategories(user?.id);
  const { data: budgets = [] } = useBudgets(user?.id);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      user: {
        email: user?.email,
        id: user?.id,
      },
      transactions,
      accounts,
      categories,
      budgets,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gestor-finanzas-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setMessage({ type: 'success', text: 'Datos exportados exitosamente' });
  };

  const handleDeleteAllData = async () => {
    setIsDeleting(true);
    setMessage(null);

    try {
      if (!user?.id) return;

      // Delete in order: budgets, transactions, categories, accounts
      await supabase.from('budgets').delete().eq('user_id', user.id);
      await supabase.from('transactions').delete().eq('user_id', user.id);
      await supabase.from('categories').delete().eq('user_id', user.id);
      await supabase.from('accounts').delete().eq('user_id', user.id);

      // Invalidate all queries
      queryClient.invalidateQueries();

      setMessage({ type: 'success', text: 'Todos los datos han sido eliminados' });
      setShowDeleteConfirm(false);
    } catch (error: any) {
      console.error('Error deleting data:', error);
      setMessage({ type: 'error', text: error.message || 'Error al eliminar los datos' });
    } finally {
      setIsDeleting(false);
    }
  };

  const stats = {
    transactions: transactions.length,
    accounts: accounts.length,
    categories: categories.length,
    budgets: budgets.length,
    total: transactions.length + accounts.length + categories.length + budgets.length,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Database className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Gestión de Datos</h3>
      </div>

      {/* Data Statistics */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Resumen de Datos</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.transactions}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Transacciones</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.accounts}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Cuentas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.categories}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Categorías</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.budgets}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Presupuestos</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* Export Data */}
        <div className="border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Download className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Exportar Datos</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Descarga una copia de todos tus datos en formato JSON. Incluye transacciones,
                cuentas, categorías y presupuestos.
              </p>
              <button
                onClick={handleExportData}
                disabled={stats.total === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Exportar Datos
              </button>
            </div>
          </div>
        </div>

        {/* Import Data (Placeholder) */}
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-5 h-5 text-gray-400" />
                <h4 className="font-semibold text-gray-500 dark:text-gray-400">Importar Datos</h4>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                La función de importar datos estará disponible próximamente.
              </p>
              <button
                disabled
                className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
              >
                <Upload className="w-4 h-4" />
                Próximamente
              </button>
            </div>
          </div>
        </div>

        {/* Delete All Data */}
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-red-900">Zona de Peligro</h4>
              </div>
              <p className="text-sm text-red-700 mb-3">
                <strong>Advertencia:</strong> Esta acción eliminará permanentemente todos tus datos:
                transacciones, cuentas, categorías y presupuestos. Esta acción no se puede deshacer.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={stats.total === 0}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar Todos los Datos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">¿Estás completamente seguro?</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Esta acción eliminará <strong className="text-red-600">{stats.total} registros</strong> de forma permanente:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mb-4 space-y-1">
              <li>{stats.transactions} transacciones</li>
              <li>{stats.accounts} cuentas</li>
              <li>{stats.categories} categorías</li>
              <li>{stats.budgets} presupuestos</li>
            </ul>
            <p className="text-sm text-red-600 font-medium mb-4">
              Esta acción NO se puede deshacer. Se recomienda exportar los datos antes de continuar.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAllData}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Eliminando...' : 'Sí, Eliminar Todo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
