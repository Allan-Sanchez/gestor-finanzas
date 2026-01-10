import { useMemo, useState, useEffect, useRef } from 'react';
import { CheckCircle, AlertCircle, Clock, Calendar, MoreVertical } from 'lucide-react';
import type { MonthlyPaymentWithTracking } from '../../types/monthly-payments';

interface PaymentCardProps {
  payment: MonthlyPaymentWithTracking;
  onTogglePaid: (id: string, isPaid: boolean) => void;
  onEdit: (payment: MonthlyPaymentWithTracking) => void;
  onDelete: (id: string) => void;
}

export default function PaymentCard({
  payment,
  onTogglePaid,
  onEdit,
  onDelete,
}: PaymentCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentDay = new Date().getDate();
  const isPaid = payment.tracking?.is_paid || false;

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  // Calcular estado del pago
  const status = useMemo(() => {
    if (isPaid) {
      return {
        color: 'green',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-500',
        textColor: 'text-green-700 dark:text-green-400',
        label: payment.tracking?.paid_date
          ? `Pagado el ${new Date(payment.tracking.paid_date).toLocaleDateString('es-GT', {
              day: 'numeric',
              month: 'short',
            })}`
          : 'Pagado',
        icon: CheckCircle,
      };
    }

    if (currentDay > payment.day_of_month) {
      const daysLate = currentDay - payment.day_of_month;
      return {
        color: 'red',
        bgColor: 'bg-white dark:bg-gray-800',
        borderColor: 'border-red-500',
        textColor: 'text-red-700 dark:text-red-400',
        label: `Vencido (${daysLate} ${daysLate === 1 ? 'día' : 'días'})`,
        icon: AlertCircle,
      };
    }

    const daysUntil = payment.day_of_month - currentDay;
    if (daysUntil <= 3) {
      return {
        color: 'yellow',
        bgColor: 'bg-white dark:bg-gray-800',
        borderColor: 'border-yellow-500',
        textColor: 'text-yellow-700 dark:text-yellow-400',
        label: `En ${daysUntil} ${daysUntil === 1 ? 'día' : 'días'}`,
        icon: Clock,
      };
    }

    const monthName = new Date().toLocaleDateString('es-GT', { month: 'short' });
    return {
      color: 'blue',
      bgColor: 'bg-white dark:bg-gray-800',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-700 dark:text-blue-400',
      label: `Vence: ${payment.day_of_month} ${monthName}`,
      icon: Calendar,
    };
  }, [isPaid, currentDay, payment]);

  return (
    <div
      className={`${status.bgColor} rounded-lg p-4 border-l-4 ${status.borderColor} hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isPaid}
          onChange={(e) => onTogglePaid(payment.id, e.target.checked)}
          className="w-5 h-5 mt-1 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />

        <div className="flex-1 min-w-0">
          {/* Header: Descripción y Monto */}
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {payment.description}
              </h3>
              {!payment.is_recurring && (
                <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full whitespace-nowrap">
                  Único
                </span>
              )}
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
              Q{payment.amount.toFixed(2)}
            </span>
          </div>

          {/* Metadata: Categoría, Cuenta, Día */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1 flex-wrap">
            {payment.categories && (
              <>
                <span>
                  {payment.categories.icon} {payment.categories.name}
                </span>
                <span>•</span>
              </>
            )}
            {payment.accounts && (
              <>
                <span>{payment.accounts.name}</span>
                <span>•</span>
              </>
            )}
            <span>Día {payment.day_of_month}</span>
          </div>

          {/* Badge de estado */}
          <div className={`flex items-center gap-2 mt-2 text-sm font-medium ${status.textColor}`}>
            <status.icon className="w-4 h-4" />
            <span>{status.label}</span>
          </div>
        </div>

        {/* Menú de acciones */}
        <div ref={menuRef} className="relative">
          <button
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>

          {/* Dropdown */}
          {showMenu && (
            <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <button
                onClick={() => {
                  onEdit(payment);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
              >
                Editar
              </button>
              <button
                onClick={() => {
                  onDelete(payment.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
