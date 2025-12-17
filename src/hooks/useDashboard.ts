import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useMonthlySummary(userId: string | undefined, month: string) {
  return useQuery({
    queryKey: ['monthly-summary', userId, month],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      const { data, error } = await supabase.rpc('get_monthly_summary', {
        p_user_id: userId,
        p_month: month,
      });

      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    },
    enabled: !!userId && !!month,
  });
}

export function useCategoryTotals(userId: string | undefined, month: string) {
  return useQuery({
    queryKey: ['category-totals', userId, month],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      const { data, error } = await supabase.rpc('get_category_totals', {
        p_user_id: userId,
        p_month: month,
      });

      if (error) throw error;
      return data;
    },
    enabled: !!userId && !!month,
  });
}

export function useMonthlyComparison(userId: string | undefined, months: number = 6) {
  return useQuery({
    queryKey: ['monthly-comparison', userId, months],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      const { data, error } = await supabase.rpc('get_monthly_comparison', {
        p_user_id: userId,
        p_months: months,
      });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useDashboardStats(userId: string | undefined, month: string) {
  const { data: summary } = useMonthlySummary(userId, month);
  const { data: budgetVsReal } = useBudgetVsReal(userId, month);

  const totalBudget = budgetVsReal?.reduce((sum, item) => sum + Number(item.budgeted_amount || 0), 0) || 0;
  const totalSpent = summary?.total_expense || 0;
  const budgetRemaining = totalBudget - totalSpent;

  return {
    totalIncome: summary?.total_income || 0,
    totalExpense: summary?.total_expense || 0,
    balance: summary?.balance || 0,
    savingsRate: summary?.savings_rate || 0,
    budgetRemaining: budgetRemaining,
  };
}

// Importar este hook desde useBudgets
import { useBudgetVsReal } from './useBudgets';
