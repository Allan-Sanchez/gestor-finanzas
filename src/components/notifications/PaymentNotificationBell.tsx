import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePaymentNotifications } from '../../hooks/useMonthlyPayments';

export default function PaymentNotificationBell() {
  const { user } = useAuth();
  const { data: notifications } = usePaymentNotifications(user?.id);
  const navigate = useNavigate();

  const count = notifications?.total || 0;

  if (count === 0) {
    return null; // No mostrar campanita si no hay pagos pendientes
  }

  return (
    <button
      onClick={() => navigate('/monthly-payments')}
      className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      title={`${count} ${count === 1 ? 'pago pendiente' : 'pagos pendientes'}`}
      aria-label={`${count} pagos pendientes`}
    >
      <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
        {count > 9 ? '9+' : count}
      </span>
    </button>
  );
}
