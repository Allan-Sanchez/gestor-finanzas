import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type {
  MonthlyPaymentInsert,
  MonthlyPaymentUpdate,
  MonthlyPaymentWithTracking,
  PaymentNotifications,
} from '../types/monthly-payments';

// Hook: Obtener todos los pagos con tracking de un mes específico
export function useMonthlyPayments(userId: string | undefined, selectedMonth?: string) {
  const currentMonth = selectedMonth || new Date().toISOString().slice(0, 7); // '2026-01'

  return useQuery({
    queryKey: ['monthly-payments', userId, currentMonth],
    queryFn: async (): Promise<MonthlyPaymentWithTracking[]> => {
      if (!userId) throw new Error('User ID required');

      // 1. Obtener plantillas activas con relaciones
      // Filtrar: recurrentes O únicos del mes seleccionado
      const { data: payments, error } = await supabase
        .from('monthly_payments')
        .select(`
          *,
          categories (
            id,
            name,
            icon,
            color
          ),
          accounts (
            id,
            name,
            type
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .or(`is_recurring.eq.true,specific_month.eq.${currentMonth}`)
        .order('day_of_month');

      if (error) throw error;
      if (!payments) return [];

      // 2. Obtener tracking del mes seleccionado
      const paymentIds = payments.map((p) => p.id);

      if (paymentIds.length === 0) return [];

      const { data: tracking } = await supabase
        .from('monthly_payment_tracking')
        .select('*')
        .eq('period', currentMonth)
        .in('payment_id', paymentIds);

      // 3. Combinar datos
      return payments.map((payment) => ({
        ...payment,
        tracking: tracking?.find((t) => t.payment_id === payment.id) || null,
      }));
    },
    enabled: !!userId,
  });
}

// Hook: Crear nuevo pago mensual
export function useCreateMonthlyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payment: MonthlyPaymentInsert) => {
      const { data, error } = await supabase
        .from('monthly_payments')
        .insert(payment)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-payments'] });
    },
  });
}

// Hook: Actualizar pago
export function useUpdateMonthlyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MonthlyPaymentUpdate }) => {
      const { error } = await supabase
        .from('monthly_payments')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-payments'] });
    },
  });
}

// Hook: Eliminar pago
export function useDeleteMonthlyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('monthly_payments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-payments'] });
    },
  });
}

// Hook: Marcar como pagado
export function useMarkAsPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentId, period }: { paymentId: string; period: string }) => {
      const today = new Date().toISOString().split('T')[0];

      // Upsert: crea si no existe, actualiza si existe
      const { error } = await supabase
        .from('monthly_payment_tracking')
        .upsert(
          {
            payment_id: paymentId,
            period: period,
            is_paid: true,
            paid_date: today,
          },
          {
            onConflict: 'payment_id,period',
          }
        );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment-notifications'] });
    },
  });
}

// Hook: Desmarcar pago
export function useUnmarkAsPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentId, period }: { paymentId: string; period: string }) => {
      const { error } = await supabase
        .from('monthly_payment_tracking')
        .upsert(
          {
            payment_id: paymentId,
            period: period,
            is_paid: false,
            paid_date: null,
          },
          {
            onConflict: 'payment_id,period',
          }
        );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment-notifications'] });
    },
  });
}

// Hook: Contador de notificaciones
export function usePaymentNotifications(userId: string | undefined) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentDay = new Date().getDate();

  return useQuery({
    queryKey: ['payment-notifications', userId, currentMonth],
    queryFn: async (): Promise<PaymentNotifications> => {
      if (!userId) throw new Error('User ID required');

      const { data: payments } = await supabase
        .from('monthly_payments')
        .select('id, day_of_month, description, amount')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (!payments || payments.length === 0) {
        return { overdue: 0, upcoming: 0, total: 0 };
      }

      const { data: tracking } = await supabase
        .from('monthly_payment_tracking')
        .select('payment_id, is_paid')
        .eq('period', currentMonth);

      let overdue = 0;
      let upcoming = 0;

      payments.forEach((p) => {
        const isPaid = tracking?.find((t) => t.payment_id === p.id)?.is_paid;
        if (isPaid) return;

        if (currentDay > p.day_of_month) {
          overdue++;
        } else if (p.day_of_month - currentDay <= 7) {
          upcoming++;
        }
      });

      return { overdue, upcoming, total: overdue + upcoming };
    },
    enabled: !!userId,
    refetchInterval: 60000, // Refetch cada minuto
  });
}

// Hook: Obtener pagos pendientes y vencidos con detalles
export function usePendingPayments(userId: string | undefined) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentDay = new Date().getDate();

  return useQuery({
    queryKey: ['pending-payments', userId, currentMonth],
    queryFn: async (): Promise<MonthlyPaymentWithTracking[]> => {
      if (!userId) throw new Error('User ID required');

      // Obtener pagos con sus relaciones
      const { data: payments } = await supabase
        .from('monthly_payments')
        .select(`
          *,
          categories (
            id,
            name,
            icon,
            color
          ),
          accounts (
            id,
            name,
            type
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('day_of_month');

      if (!payments || payments.length === 0) return [];

      // Obtener tracking del mes actual
      const { data: tracking } = await supabase
        .from('monthly_payment_tracking')
        .select('*')
        .eq('period', currentMonth)
        .in('payment_id', payments.map(p => p.id));

      // Combinar y filtrar solo pendientes y vencidos
      const combined: MonthlyPaymentWithTracking[] = payments.map((payment) => ({
        ...payment,
        tracking: tracking?.find((t) => t.payment_id === payment.id) || null,
      }));

      // Filtrar solo los no pagados que están vencidos o próximos (7 días)
      return combined.filter((p) => {
        const isPaid = p.tracking?.is_paid;
        if (isPaid) return false;

        // Vencidos o próximos (dentro de 7 días)
        if (currentDay > p.day_of_month) return true; // Vencido
        if (p.day_of_month - currentDay <= 7) return true; // Próximo

        return false;
      });
    },
    enabled: !!userId,
    refetchInterval: 60000, // Refetch cada minuto
  });
}
