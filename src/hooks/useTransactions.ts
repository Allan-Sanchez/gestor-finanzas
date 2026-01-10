import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type {
  Transaction,
  TransactionInsert,
  TransactionUpdate,
  TransactionWithRelations,
  TransactionFilters,
} from '../types';

export function useTransactions(userId: string | undefined, filters?: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', userId, filters],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      let query = supabase
        .from('transactions')
        .select('*, categories(*), accounts(*)')
        .eq('user_id', userId);

      // Aplicar filtros
      if (filters?.dateRange) {
        query = query
          .gte('date', filters.dateRange.startDate)
          .lte('date', filters.dateRange.endDate);
      }

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters?.accountId) {
        query = query.eq('account_id', filters.accountId);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.searchTerm) {
        query = query.ilike('description', `%${filters.searchTerm}%`);
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) throw error;
      return data as TransactionWithRelations[];
    },
    enabled: !!userId,
  });
}

// Función para detectar coincidencias con pagos mensuales
async function detectMonthlyPaymentMatch(transaction: Transaction) {
  const userId = transaction.user_id;
  const transactionDate = new Date(transaction.date);
  const dayOfMonth = transactionDate.getDate();
  const period = transaction.date.slice(0, 7); // '2026-01'

  // Solo procesar gastos
  if (transaction.type !== 'expense') return null;

  // Buscar pagos mensuales activos del usuario con misma categoría
  const { data: monthlyPayments } = await supabase
    .from('monthly_payments')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .eq('category_id', transaction.category_id);

  if (!monthlyPayments || monthlyPayments.length === 0) return null;

  // Filtrar por coincidencia de monto y fecha
  const matches = monthlyPayments.filter((mp) => {
    // Monto exacto (tolerancia de ±0.01)
    const amountMatch = Math.abs(mp.amount - transaction.amount) < 0.01;

    // Fecha cercana (±5 días de tolerancia)
    const dayDiff = Math.abs(dayOfMonth - mp.day_of_month);
    const dateMatch = dayDiff <= 5;

    return amountMatch && dateMatch;
  });

  // Solo marcar automáticamente si hay EXACTAMENTE una coincidencia
  if (matches.length === 1) {
    return { payment: matches[0], period };
  }

  return null;
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: TransactionInsert) => {
      // 1. Crear la transacción
      const { data: newTransaction, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single();

      if (error) throw error;

      // 2. Detectar si corresponde a un pago mensual
      try {
        const match = await detectMonthlyPaymentMatch(newTransaction);

        // 3. Si hay coincidencia, marcar como pagado automáticamente
        if (match) {
          await supabase
            .from('monthly_payment_tracking')
            .upsert(
              {
                payment_id: match.payment.id,
                period: match.period,
                is_paid: true,
                paid_date: newTransaction.date,
                transaction_id: newTransaction.id,
              },
              {
                onConflict: 'payment_id,period',
              }
            );

          // Notificación al usuario (opcional, depende si usas toast)
          console.log(`✓ Pago mensual "${match.payment.description}" marcado automáticamente`);
        }
      } catch (error) {
        // Si falla la detección, continuar igual (no bloquear la creación)
        console.warn('Error en detección automática:', error);
      }

      return newTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account-balances'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
      queryClient.invalidateQueries({ queryKey: ['category-totals'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-comparison'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-payments'] }); // Invalidar también pagos mensuales
      queryClient.invalidateQueries({ queryKey: ['payment-notifications'] }); // Y notificaciones
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TransactionUpdate }) => {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account-balances'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
      queryClient.invalidateQueries({ queryKey: ['category-totals'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-comparison'] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account-balances'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
      queryClient.invalidateQueries({ queryKey: ['category-totals'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-comparison'] });
    },
  });
}

export function useRecentTransactions(userId: string | undefined, limit: number = 10) {
  return useQuery({
    queryKey: ['transactions', 'recent', userId, limit],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      const { data, error } = await supabase
        .from('transactions')
        .select('*, categories(*), accounts(*)')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as TransactionWithRelations[];
    },
    enabled: !!userId,
  });
}
