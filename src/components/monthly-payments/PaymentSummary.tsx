import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { MonthlyPaymentWithTracking } from '../../types/monthly-payments';

interface PaymentSummaryProps {
  payments: MonthlyPaymentWithTracking[];
}

export default function PaymentSummary({ payments }: PaymentSummaryProps) {
  const currentDay = new Date().getDate();

  // Calcular métricas
  const totalPayments = payments.length;
  const paidCount = payments.filter((p) => p.tracking?.is_paid).length;

  const pendingPayments = payments.filter((p) => !p.tracking?.is_paid);
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  const overdueCount = pendingPayments.filter((p) => currentDay > p.day_of_month).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {/* Card 1: Pagados */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Pagados
          </span>
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {paidCount} / {totalPayments}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {totalPayments === 0
            ? 'Sin pagos configurados'
            : paidCount === totalPayments
            ? 'Todos completados'
            : `${totalPayments - paidCount} pendientes`}
        </p>
      </div>

      {/* Card 2: Pendientes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Pendientes
          </span>
          <Clock className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          Q{pendingAmount.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {pendingPayments.length} {pendingPayments.length === 1 ? 'pago' : 'pagos'} por realizar
        </p>
      </div>

      {/* Card 3: Vencidos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Vencidos
          </span>
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {overdueCount}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {overdueCount === 0 ? 'Todo al día' : 'Requieren atención'}
        </p>
      </div>
    </div>
  );
}
