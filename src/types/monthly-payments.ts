import type { Database } from './database';

// Tipos base de las tablas
export type MonthlyPayment = Database['public']['Tables']['monthly_payments']['Row'];
export type MonthlyPaymentInsert = Database['public']['Tables']['monthly_payments']['Insert'];
export type MonthlyPaymentUpdate = Database['public']['Tables']['monthly_payments']['Update'];

export type MonthlyPaymentTracking = Database['public']['Tables']['monthly_payment_tracking']['Row'];
export type MonthlyPaymentTrackingInsert = Database['public']['Tables']['monthly_payment_tracking']['Insert'];
export type MonthlyPaymentTrackingUpdate = Database['public']['Tables']['monthly_payment_tracking']['Update'];

// Tipos extendidos con relaciones
export type MonthlyPaymentWithRelations = MonthlyPayment & {
  categories?: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
  } | null;
  accounts?: {
    id: string;
    name: string;
    type: 'cash' | 'debit' | 'credit' | 'savings';
  } | null;
};

export type MonthlyPaymentWithTracking = MonthlyPaymentWithRelations & {
  tracking: MonthlyPaymentTracking | null;
};

// Estados de pago
export type PaymentStatus = 'paid' | 'overdue' | 'upcoming' | 'pending';

// Información de estado calculado
export interface PaymentStatusInfo {
  status: PaymentStatus;
  color: 'green' | 'red' | 'yellow' | 'blue';
  label: string;
  icon: 'CheckCircle' | 'AlertCircle' | 'Clock' | 'Calendar';
}

// Notificaciones
export interface PaymentNotifications {
  overdue: number;
  upcoming: number;
  total: number;
}

// Resumen de pagos del mes
export interface PaymentSummary {
  totalPayments: number;
  paidCount: number;
  pendingAmount: number;
  overdueCount: number;
}
