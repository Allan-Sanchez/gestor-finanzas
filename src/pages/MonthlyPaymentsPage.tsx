import { Plus, Repeat, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  useMonthlyPayments,
  useCreateMonthlyPayment,
  useUpdateMonthlyPayment,
  useDeleteMonthlyPayment,
  useMarkAsPaid,
  useUnmarkAsPaid,
} from '../hooks/useMonthlyPayments';
import PaymentSummary from '../components/monthly-payments/PaymentSummary';
import PaymentCard from '../components/monthly-payments/PaymentCard';
import PaymentForm from '../components/monthly-payments/PaymentForm';
import { ConfirmDialog } from '../components/ui';
import type { MonthlyPaymentWithTracking, MonthlyPaymentInsert, MonthlyPaymentUpdate } from '../types/monthly-payments';

export default function MonthlyPaymentsPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<MonthlyPaymentWithTracking | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const { data: payments, isLoading } = useMonthlyPayments(user?.id, selectedMonth);
  const createPayment = useCreateMonthlyPayment();
  const updatePayment = useUpdateMonthlyPayment();
  const deletePayment = useDeleteMonthlyPayment();
  const markAsPaid = useMarkAsPaid();
  const unmarkAsPaid = useUnmarkAsPaid();

  const selectedMonthName = new Date(selectedMonth + '-01').toLocaleDateString('es-GT', {
    month: 'long',
    year: 'numeric',
  });

  // Funciones para navegar entre meses
  const goToPreviousMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const prevMonth = new Date(year, month - 2, 1); // month - 2 porque los meses empiezan en 0
    setSelectedMonth(prevMonth.toISOString().slice(0, 7));
  };

  const goToNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const nextMonth = new Date(year, month, 1); // month porque ya estamos en el siguiente
    setSelectedMonth(nextMonth.toISOString().slice(0, 7));
  };

  const goToCurrentMonth = () => {
    setSelectedMonth(new Date().toISOString().slice(0, 7));
  };

  const isCurrentMonth = selectedMonth === new Date().toISOString().slice(0, 7);

  const handleTogglePaid = async (paymentId: string, isPaid: boolean) => {
    try {
      if (isPaid) {
        await markAsPaid.mutateAsync({ paymentId, period: selectedMonth });
      } else {
        await unmarkAsPaid.mutateAsync({ paymentId, period: selectedMonth });
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const handleSubmit = (data: MonthlyPaymentInsert | MonthlyPaymentUpdate) => {
    if (selectedPayment) {
      updatePayment.mutate(
        { id: selectedPayment.id, data },
        {
          onSuccess: () => {
            setShowForm(false);
            setSelectedPayment(null);
          },
        }
      );
    } else {
      createPayment.mutate(data as MonthlyPaymentInsert, {
        onSuccess: () => {
          setShowForm(false);
        },
      });
    }
  };

  const handleEdit = (payment: MonthlyPaymentWithTracking) => {
    setSelectedPayment(payment);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deletePayment.mutate(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
        },
      });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedPayment(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando pagos mensuales...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Pagos Mensuales
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Controla tus pagos recurrentes del mes
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Pago
        </button>
      </div>

      {/* Selector de Mes */}
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Mes anterior"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="flex items-center gap-3">
          <Repeat className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
            {selectedMonthName}
          </h2>
          {!isCurrentMonth && (
            <button
              onClick={goToCurrentMonth}
              className="ml-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ir a mes actual
            </button>
          )}
        </div>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Mes siguiente"
        >
          <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Summary Cards */}
      <PaymentSummary payments={payments || []} />

      {/* Lista de pagos */}
      {!payments || payments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Repeat className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No hay pagos mensuales configurados
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Comienza agregando tus pagos recurrentes como Netflix, Spotify, Alquiler, etc.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Crear Primer Pago
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize">
            Pagos de {selectedMonthName}
          </h2>
          <div className="space-y-3">
            {payments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onTogglePaid={handleTogglePaid}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Formulario Modal */}
      {showForm && (
        <PaymentForm
          isOpen={showForm}
          payment={selectedPayment}
          onSubmit={handleSubmit}
          onClose={handleCloseForm}
          isLoading={createPayment.isPending || updatePayment.isPending}
        />
      )}

      {/* Confirm Delete Dialog */}
      {deleteId && (
        <ConfirmDialog
          isOpen={!!deleteId}
          title="Eliminar pago mensual"
          message="¿Estás seguro de que deseas eliminar este pago mensual? Esta acción no se puede deshacer."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}
    </div>
  );
}
