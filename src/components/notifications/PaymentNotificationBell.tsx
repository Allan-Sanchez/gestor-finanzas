import { useState, useEffect, useRef } from 'react';
import { Bell, AlertCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePaymentNotifications, usePendingPayments } from '../../hooks/useMonthlyPayments';

export default function PaymentNotificationBell() {
  const { user } = useAuth();
  const { data: notifications } = usePaymentNotifications(user?.id);
  const { data: pendingPayments } = usePendingPayments(user?.id);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const count = notifications?.total || 0;

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  if (count === 0) {
    return null; // No mostrar campanita si no hay pagos pendientes
  }

  const currentDay = new Date().getDate();

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title={`${count} ${count === 1 ? 'pago pendiente' : 'pagos pendientes'}`}
        aria-label={`${count} pagos pendientes`}
      >
        <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
          {count > 9 ? '9+' : count}
        </span>
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute -right-4 md:-right-[100px] mt-2 w-[calc(100vw-2rem)] md:w-80 max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Pagos Pendientes ({count})
            </h3>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {pendingPayments && pendingPayments.length > 0 ? (
              pendingPayments.map((payment) => {
                const isOverdue = currentDay > payment.day_of_month;
                const daysUntil = payment.day_of_month - currentDay;
                const daysLate = currentDay - payment.day_of_month;

                return (
                  <button
                    key={payment.id}
                    onClick={() => {
                      navigate('/monthly-payments');
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`mt-1 ${isOverdue ? 'text-red-500' : 'text-yellow-500'}`}>
                        {isOverdue ? (
                          <AlertCircle className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {payment.description}
                          </p>
                          <span className="font-bold text-gray-900 dark:text-white whitespace-nowrap text-sm">
                            Q{payment.amount.toFixed(2)}
                          </span>
                        </div>

                        {/* Category */}
                        {payment.categories && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {payment.categories.icon} {payment.categories.name}
                          </p>
                        )}

                        {/* Status */}
                        <p className={`text-xs font-medium mt-1 ${
                          isOverdue
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {isOverdue
                            ? `Vencido hace ${daysLate} ${daysLate === 1 ? 'día' : 'días'}`
                            : `Vence en ${daysUntil} ${daysUntil === 1 ? 'día' : 'días'}`
                          }
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No hay pagos pendientes
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                navigate('/monthly-payments');
                setShowDropdown(false);
              }}
              className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Ver todos los pagos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
