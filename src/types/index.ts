import type { Database } from './database';

// Tipos extraídos de la base de datos
export type User = Database['public']['Tables']['users']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Account = Database['public']['Tables']['accounts']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type Budget = Database['public']['Tables']['budgets']['Row'];

// Tipos para inserts
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
export type BudgetInsert = Database['public']['Tables']['budgets']['Insert'];

// Tipos para updates
export type UserUpdate = Database['public']['Tables']['users']['Update'];
export type CategoryUpdate = Database['public']['Tables']['categories']['Update'];
export type AccountUpdate = Database['public']['Tables']['accounts']['Update'];
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];
export type BudgetUpdate = Database['public']['Tables']['budgets']['Update'];

// Enums
export type CategoryType = Database['public']['Enums']['category_type'];
export type AccountType = Database['public']['Enums']['account_type'];
export type TransactionType = Database['public']['Enums']['transaction_type'];
export type TransactionStatus = Database['public']['Enums']['transaction_status'];

// Tipos para funciones RPC
export type MonthlySummary = Database['public']['Functions']['get_monthly_summary']['Returns'][0];
export type CategoryTotal = Database['public']['Functions']['get_category_totals']['Returns'][0];
export type AccountBalance = Database['public']['Functions']['get_account_balances']['Returns'][0];
export type MonthlyComparison = Database['public']['Functions']['get_monthly_comparison']['Returns'][0];
export type BudgetVsReal = Database['public']['Functions']['get_budget_vs_real']['Returns'][0];

// Transaction con relaciones expandidas
export interface TransactionWithRelations extends Transaction {
  categories: Category | null;
  accounts: Account;
}

// Tipos de utilidad
export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface TransactionFilters {
  dateRange?: DateRange;
  type?: TransactionType;
  categoryId?: string;
  accountId?: string;
  status?: TransactionStatus;
  searchTerm?: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
  budgetRemaining: number;
}
