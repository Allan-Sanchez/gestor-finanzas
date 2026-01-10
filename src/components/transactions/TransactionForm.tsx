import { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '../ui';
import type { TransactionWithRelations, TransactionInsert, TransactionUpdate, Account, Category } from '../../types';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionInsert | TransactionUpdate) => void;
  transaction?: TransactionWithRelations | null;
  userId: string;
  accounts: Account[];
  categories: Category[];
  isLoading?: boolean;
}

const transactionTypes = [
  { value: 'income', label: 'Ingreso' },
  { value: 'expense', label: 'Egreso' },
  { value: 'transfer', label: 'Transferencia' },
];

const transactionStatuses = [
  { value: 'paid', label: 'Pagado' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'cancelled', label: 'Cancelado' },
];

export default function TransactionForm({
  isOpen,
  onClose,
  onSubmit,
  transaction,
  userId,
  accounts,
  categories,
  isLoading = false,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as 'income' | 'expense' | 'transfer',
    category_id: '',
    account_id: '',
    amount: '',
    description: '',
    payment_method: '',
    status: 'paid' as 'paid' | 'pending' | 'cancelled',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date.split('T')[0],
        type: transaction.type,
        category_id: transaction.category_id || '',
        account_id: transaction.account_id,
        amount: transaction.amount.toString(),
        description: transaction.description,
        payment_method: transaction.payment_method || '',
        status: transaction.status,
        notes: transaction.notes || '',
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        category_id: '',
        account_id: accounts[0]?.id || '',
        amount: '',
        description: '',
        payment_method: '',
        status: 'paid',
        notes: '',
      });
    }
    setErrors({});
  }, [transaction, isOpen, accounts]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.account_id) {
      newErrors.account_id = 'Debes seleccionar una cuenta';
    }

    if (formData.type !== 'transfer' && !formData.category_id) {
      newErrors.category_id = 'Debes seleccionar una categoría';
    }

    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = 'El monto debe ser un número válido mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const amount = parseFloat(formData.amount);

    if (transaction) {
      // Actualizar transacción existente
      const updates: TransactionUpdate = {
        date: formData.date,
        type: formData.type,
        category_id: formData.type === 'transfer' ? null : formData.category_id || null,
        account_id: formData.account_id,
        amount,
        description: formData.description,
        payment_method: formData.payment_method || null,
        status: formData.status,
        notes: formData.notes || null,
      };
      onSubmit(updates);
    } else {
      // Crear nueva transacción
      const newTransaction: TransactionInsert = {
        user_id: userId,
        date: formData.date,
        type: formData.type,
        category_id: formData.type === 'transfer' ? null : formData.category_id || null,
        account_id: formData.account_id,
        amount,
        description: formData.description,
        payment_method: formData.payment_method || null,
        status: formData.status,
        notes: formData.notes || null,
      };
      onSubmit(newTransaction);
    }
  };

  // Filtrar categorías según el tipo de transacción
  const filteredCategories = categories.filter(
    (cat) => cat.type === formData.type
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transaction ? 'Editar Transacción' : 'Nueva Transacción'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha *
              </label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                error={errors.date}
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo *
              </label>
              <Select
                id="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as 'income' | 'expense' | 'transfer',
                    category_id: '', // Reset category when type changes
                  })
                }
                options={transactionTypes}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción *
            </label>
            <Input
              id="description"
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ej: Compra en supermercado"
              error={errors.description}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="account_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cuenta *
              </label>
              <Select
                id="account_id"
                value={formData.account_id}
                onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                options={accounts.map((acc) => ({
                  value: acc.id,
                  label: acc.name,
                }))}
                error={errors.account_id}
              />
            </div>

            {formData.type !== 'transfer' && (
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoría *
                </label>
                <Select
                  id="category_id"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  options={[
                    { value: '', label: 'Selecciona una categoría' },
                    ...filteredCategories.map((cat) => ({
                      value: cat.id,
                      label: `${cat.icon} ${cat.name}`,
                    })),
                  ]}
                  error={errors.category_id}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monto *
              </label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                error={errors.amount}
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estado *
              </label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'paid' | 'pending' | 'cancelled',
                  })
                }
                options={transactionStatuses}
              />
            </div>
          </div>

          <div>
            <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Método de pago (opcional)
            </label>
            <Input
              id="payment_method"
              type="text"
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              placeholder="Ej: Tarjeta de crédito, Efectivo"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notas (opcional)
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Agrega notas adicionales..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Guardando...' : transaction ? 'Actualizar' : 'Crear Transacción'}
            </Button>
          </div>
        </form>
    </Modal>
  );
}
