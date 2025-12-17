import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea un número como moneda
 */
export function formatCurrency(amount: number, currency: string = 'GTQ'): string {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formatea una fecha en formato legible
 */
export function formatDate(date: string | Date, formatString: string = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString, { locale: es });
}

/**
 * Formatea una fecha como "5 de enero de 2025"
 */
export function formatLongDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, "d 'de' MMMM 'de' yyyy", { locale: es });
}

/**
 * Obtiene el primer día del mes
 */
export function getStartOfMonth(date: Date = new Date()): Date {
  return startOfMonth(date);
}

/**
 * Obtiene el último día del mes
 */
export function getEndOfMonth(date: Date = new Date()): Date {
  return endOfMonth(date);
}

/**
 * Obtiene el mes anterior
 */
export function getPreviousMonth(date: Date = new Date()): Date {
  return subMonths(date, 1);
}

/**
 * Formatea una fecha para usarla en SQL (YYYY-MM-DD)
 */
export function formatDateForDB(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Obtiene el nombre del mes
 */
export function getMonthName(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMMM yyyy', { locale: es });
}

/**
 * Formatea un porcentaje
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Obtiene el color para un tipo de transacción
 */
export function getTransactionColor(type: 'income' | 'expense'): string {
  return type === 'income' ? '#10B981' : '#EF4444';
}

/**
 * Obtiene el label para un tipo de transacción
 */
export function getTransactionTypeLabel(type: 'income' | 'expense' | 'transfer'): string {
  const labels = {
    income: 'Ingreso',
    expense: 'Egreso',
    transfer: 'Transferencia',
  };
  return labels[type];
}

/**
 * Obtiene el label para un estado de transacción
 */
export function getTransactionStatusLabel(status: 'paid' | 'pending' | 'cancelled'): string {
  const labels = {
    paid: 'Pagado',
    pending: 'Pendiente',
    cancelled: 'Cancelado',
  };
  return labels[status];
}

/**
 * Obtiene el label para un tipo de cuenta
 */
export function getAccountTypeLabel(type: 'cash' | 'debit' | 'credit' | 'savings'): string {
  const labels = {
    cash: 'Efectivo',
    debit: 'Débito',
    credit: 'Crédito',
    savings: 'Ahorros',
  };
  return labels[type];
}

/**
 * Trunca un texto largo
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Calcula el porcentaje de uso de presupuesto
 */
export function calculateBudgetPercentage(spent: number, budgeted: number): number {
  if (budgeted === 0) return 0;
  return (spent / budgeted) * 100;
}

/**
 * Obtiene la clase de color según el porcentaje de presupuesto
 */
export function getBudgetColorClass(percentage: number): string {
  if (percentage >= 100) return 'text-red-600';
  if (percentage >= 80) return 'text-orange-600';
  if (percentage >= 60) return 'text-yellow-600';
  return 'text-green-600';
}
