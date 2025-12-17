import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Budget, BudgetInsert, BudgetUpdate } from '../types';

export function useBudgets(userId: string | undefined, month?: string) {
  return useQuery({
    queryKey: ['budgets', userId, month],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      let query = supabase.from('budgets').select('*').eq('user_id', userId);

      if (month) {
        query = query.eq('month', month);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as Budget[];
    },
    enabled: !!userId,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budget: BudgetInsert) => {
      const { data, error } = await supabase
        .from('budgets')
        .insert(budget)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budget-vs-real'] });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: BudgetUpdate }) => {
      const { data, error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budget-vs-real'] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('budgets').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budget-vs-real'] });
    },
  });
}

export function useBudgetVsReal(userId: string | undefined, month: string) {
  return useQuery({
    queryKey: ['budget-vs-real', userId, month],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      const { data, error } = await supabase.rpc('get_budget_vs_real', {
        p_user_id: userId,
        p_month: month,
      });

      if (error) throw error;
      return data;
    },
    enabled: !!userId && !!month,
  });
}
