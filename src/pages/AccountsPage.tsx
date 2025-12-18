import { useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import { Card, CardContent, Button, Loading } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from '../hooks/useAccounts';
import AccountCard from '../components/accounts/AccountCard';
import AccountForm from '../components/accounts/AccountForm';
import type { Account, AccountInsert, AccountUpdate } from '../types';
import { formatCurrency } from '../utils/format';

export default function AccountsPage() {
  const { user } = useAuth();
  const { data: accounts, isLoading } = useAccounts(user?.id);
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const handleCreateAccount = async (data: AccountInsert | AccountUpdate) => {
    try {
      if (selectedAccount) {
        await updateAccount.mutateAsync({
          id: selectedAccount.id,
          updates: data as AccountUpdate,
        });
      } else {
        await createAccount.mutateAsync(data as AccountInsert);
      }
      setIsFormOpen(false);
      setSelectedAccount(null);
    } catch (error) {
      console.error('Error al guardar cuenta:', error);
      alert('Error al guardar la cuenta. Por favor intenta nuevamente.');
    }
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setIsFormOpen(true);
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      await deleteAccount.mutateAsync(id);
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      alert('Error al eliminar la cuenta. Por favor intenta nuevamente.');
    }
  };

  const handleNewAccount = () => {
    setSelectedAccount(null);
    setIsFormOpen(true);
  };

  const totalBalance = accounts?.reduce((sum, account) => sum + account.current_balance, 0) || 0;

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Cuentas</h1>
          <p className="text-gray-600 mt-1">Gestiona tus cuentas bancarias y efectivo</p>
        </div>
        <Button onClick={handleNewAccount}>
          <Plus className="w-5 h-5 mr-2" />
          Nueva Cuenta
        </Button>
      </div>

      {/* Total Balance Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Wallet className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Balance Total</p>
                <p className={`text-3xl font-bold ${
                  totalBalance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(totalBalance)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total de cuentas</p>
              <p className="text-2xl font-semibold text-gray-900">{accounts?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accounts List */}
      {accounts && accounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onEdit={handleEditAccount}
              onDelete={handleDeleteAccount}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes cuentas registradas
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza agregando tu primera cuenta para gestionar tus finanzas
            </p>
            <Button onClick={handleNewAccount}>
              <Plus className="w-5 h-5 mr-2" />
              Crear Primera Cuenta
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Account Form Modal */}
      {user && (
        <AccountForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedAccount(null);
          }}
          onSubmit={handleCreateAccount}
          account={selectedAccount}
          userId={user.id}
          isLoading={createAccount.isPending || updateAccount.isPending}
        />
      )}
    </div>
  );
}
