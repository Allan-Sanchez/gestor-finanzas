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

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: TransactionInsert) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
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
