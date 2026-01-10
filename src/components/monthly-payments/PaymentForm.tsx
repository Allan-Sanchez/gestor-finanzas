import { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '../ui';
import { useCategories } from '../../hooks/useCategories';
import { useAccounts } from '../../hooks/useAccounts';
import { useAuth } from '../../hooks/useAuth';
import type { MonthlyPaymentWithTracking, MonthlyPaymentInsert, MonthlyPaymentUpdate } from '../../types/monthly-payments';

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MonthlyPaymentInsert | MonthlyPaymentUpdate) => void;
  payment?: MonthlyPaymentWithTracking | null;
  isLoading?: boolean;
}

export default function PaymentForm({
  isOpen,
  onClose,
  onSubmit,
  payment,
  isLoading = false,
}: PaymentFormProps) {
  const { user } = useAuth();
  const { data: categories } = useCategories(user?.id);
  const { data: accounts } = useAccounts(user?.id);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    day_of_month: '1',
    category_id: '',
    account_id: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar datos del pago en edición
  useEffect(() => {
    if (payment) {
      setFormData({
        description: payment.description,
        amount: payment.amount.toString(),
        day_of_month: payment.day_of_month.toString(),
        category_id: payment.category_id || '',
        account_id: payment.account_id || '',
        notes: payment.notes || '',
      });
    } else {
      // Resetear formulario para nuevo pago
      const expenseCategories = categories?.filter((c) => c.type === 'expense');
      setFormData({
        description: '',
        amount: '',
        day_of_month: '1',
        category_id: expenseCategories?.[0]?.id || '',
        account_id: accounts?.[0]?.id || '',
        notes: '',
      });
    }
    setErrors({});
  }, [payment, isOpen, categories, accounts]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }

    const dayOfMonth = parseInt(formData.day_of_month);
    if (!formData.day_of_month || isNaN(dayOfMonth) || dayOfMonth < 1 || dayOfMonth > 31) {
      newErrors.day_of_month = 'El día debe estar entre 1 y 31';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'La categoría es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!user) return;

    const data: MonthlyPaymentInsert | MonthlyPaymentUpdate = {
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      day_of_month: parseInt(formData.day_of_month),
      category_id: formData.category_id || null,
      account_id: formData.account_id || null,
      notes: formData.notes.trim() || null,
    };

    // Agregar user_id solo en inserts
    if (!payment) {
      (data as MonthlyPaymentInsert).user_id = user.id;
    }

    onSubmit(data);
  };

  // Filtrar solo categorías de gastos
  const expenseCategories = categories?.filter((c) => c.type === 'expense') || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {payment ? 'Editar Pago Mensual' : 'Nuevo Pago Mensual'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Descripción */}
          <Input
            label="Descripción"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Ej: Netflix, Spotify, Alquiler"
            error={errors.description}
            required
          />

          {/* Monto y Día del mes */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Monto"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              error={errors.amount}
              required
            />

            <Input
              label="Día del mes"
              type="number"
              min="1"
              max="31"
              value={formData.day_of_month}
              onChange={(e) => setFormData({ ...formData, day_of_month: e.target.value })}
              placeholder="1"
              error={errors.day_of_month}
              required
            />
          </div>

          {/* Categoría */}
          <Select
            label="Categoría"
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            options={[
              { value: '', label: 'Selecciona una categoría' },
              ...expenseCategories.map((category) => ({
                value: category.id,
                label: `${category.icon} ${category.name}`,
              })),
            ]}
            error={errors.category_id}
            required
          />

          {/* Cuenta (opcional) */}
          <Select
            label="Cuenta (opcional)"
            value={formData.account_id}
            onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
            options={[
              { value: '', label: 'Sin cuenta asignada' },
              ...(accounts || []).map((account) => ({
                value: account.id,
                label: account.name,
              })),
            ]}
          />

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notas (opcional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Agregar notas adicionales..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : payment ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
