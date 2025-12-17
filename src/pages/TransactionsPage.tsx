import { useState } from 'react';
import { Plus, Receipt } from 'lucide-react';
import { Card, CardContent, Button, Loading } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from '../hooks/useTransactions';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { useIsMobile } from '../hooks/useIsMobile';
import TransactionRow from '../components/transactions/TransactionRow';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionFilters from '../components/transactions/TransactionFilters';
import MobileTransactionList from '../components/transactions/MobileTransactionList';
import type { TransactionWithRelations, TransactionInsert, TransactionUpdate, TransactionFilters as TFilters } from '../types';

export default function TransactionsPage() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState<TFilters>({});
  const { data: transactions, isLoading } = useTransactions(user?.id, filters);
  const { data: accounts = [] } = useAccounts(user?.id);
  const { data: categories = [] } = useCategories(user?.id);
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithRelations | null>(null);

  const handleCreateTransaction = async (data: TransactionInsert | TransactionUpdate) => {
    try {
      if (selectedTransaction) {
        await updateTransaction.mutateAsync({
          id: selectedTransaction.id,
          updates: data as TransactionUpdate,
        });
      } else {
        await createTransaction.mutateAsync(data as TransactionInsert);
      }
      setIsFormOpen(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Error al guardar transacción:', error);
      alert('Error al guardar la transacción. Por favor intenta nuevamente.');
    }
  };

  const handleEditTransaction = (transaction: TransactionWithRelations) => {
    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction.mutateAsync(id);
    } catch (error) {
      console.error('Error al eliminar transacción:', error);
      alert('Error al eliminar la transacción. Por favor intenta nuevamente.');
    }
  };

  const handleNewTransaction = () => {
    setSelectedTransaction(null);
    setIsFormOpen(true);
  };

  // Calcular totales
  const totalIncome = transactions?.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalExpense = transactions?.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0;
  const balance = totalIncome - totalExpense;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Transacciones</h1>
          <p className="text-gray-600 mt-1">Gestiona tus ingresos y gastos</p>
        </div>
        <Button onClick={handleNewTransaction} disabled={accounts.length === 0}>
          <Plus className="w-5 h-5 mr-2" />
          Nueva Transacción
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Ingresos</p>
            <p className="text-2xl font-bold text-green-600">
              Q{totalIncome.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Egresos</p>
            <p className="text-2xl font-bold text-red-600">
              Q{totalExpense.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Balance</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Q{balance.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <TransactionFilters
        filters={filters}
        onFiltersChange={setFilters}
        accounts={accounts}
        categories={categories}
      />

      {/* Transactions List/Table */}
      {accounts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Crea una cuenta primero
            </h3>
            <p className="text-gray-600 mb-6">
              Necesitas crear al menos una cuenta antes de registrar transacciones
            </p>
          </CardContent>
        </Card>
      ) : transactions && transactions.length > 0 ? (
        isMobile ? (
          <MobileTransactionList
            transactions={transactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cuenta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <TransactionRow
                        key={transaction.id}
                        transaction={transaction}
                        onEdit={handleEditTransaction}
                        onDelete={handleDeleteTransaction}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay transacciones
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza registrando tu primera transacción
            </p>
            <Button onClick={handleNewTransaction}>
              <Plus className="w-5 h-5 mr-2" />
              Crear Primera Transacción
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Transaction Form Modal */}
      {user && (
        <TransactionForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedTransaction(null);
          }}
          onSubmit={handleCreateTransaction}
          transaction={selectedTransaction}
          userId={user.id}
          accounts={accounts}
          categories={categories}
          isLoading={createTransaction.isPending || updateTransaction.isPending}
        />
      )}
    </div>
  );
}
