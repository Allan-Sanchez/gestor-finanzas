import { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '../ui';
import type { Account, AccountInsert, AccountUpdate } from '../../types';

interface AccountFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AccountInsert | AccountUpdate) => void;
  account?: Account | null;
  userId: string;
  isLoading?: boolean;
}

const accountTypes = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'debit', label: 'Débito' },
  { value: 'credit', label: 'Crédito' },
  { value: 'savings', label: 'Ahorros' },
];

export default function AccountForm({
  isOpen,
  onClose,
  onSubmit,
  account,
  userId,
  isLoading = false,
}: AccountFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'debit' as 'cash' | 'debit' | 'credit' | 'savings',
    initial_balance: '0',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        type: account.type,
        initial_balance: account.initial_balance.toString(),
      });
    } else {
      setFormData({
        name: '',
        type: 'debit',
        initial_balance: '0',
      });
    }
    setErrors({});
  }, [account, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    const balance = parseFloat(formData.initial_balance);
    if (isNaN(balance)) {
      newErrors.initial_balance = 'El balance debe ser un número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const balance = parseFloat(formData.initial_balance);

    if (account) {
      // Actualizar cuenta existente
      const updates: AccountUpdate = {
        name: formData.name,
        type: formData.type,
      };
      onSubmit(updates);
    } else {
      // Crear nueva cuenta
      const newAccount: AccountInsert = {
        user_id: userId,
        name: formData.name,
        type: formData.type,
        initial_balance: balance,
        current_balance: balance,
      };
      onSubmit(newAccount);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={account ? 'Editar Cuenta' : 'Nueva Cuenta'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre de la cuenta *
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Cuenta Corriente Principal"
              error={errors.name}
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de cuenta *
            </label>
            <Select
              id="type"
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as 'cash' | 'debit' | 'credit' | 'savings',
                })
              }
              options={accountTypes}
            />
          </div>

          {!account && (
            <div>
              <label
                htmlFor="initial_balance"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Balance inicial *
              </label>
              <Input
                id="initial_balance"
                type="number"
                step="0.01"
                value={formData.initial_balance}
                onChange={(e) =>
                  setFormData({ ...formData, initial_balance: e.target.value })
                }
                placeholder="0.00"
                error={errors.initial_balance}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                El balance actual se establecerá con este valor inicial
              </p>
            </div>
          )}

          {account && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> El balance inicial y actual no se pueden modificar
                directamente. Estos se actualizan automáticamente con las transacciones.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Guardando...' : account ? 'Actualizar' : 'Crear Cuenta'}
            </Button>
          </div>
        </form>
    </Modal>
  );
}
