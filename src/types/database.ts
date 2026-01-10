export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          currency: string
          default_budget_month: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          currency?: string
          default_budget_month?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          currency?: string
          default_budget_month?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'income' | 'expense'
          icon: string | null
          color: string | null
          monthly_budget: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'income' | 'expense'
          icon?: string | null
          color?: string | null
          monthly_budget?: number | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'income' | 'expense'
          icon?: string | null
          color?: string | null
          monthly_budget?: number | null
          is_active?: boolean
          created_at?: string
        }
      }
      accounts: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'cash' | 'debit' | 'credit' | 'savings'
          initial_balance: number
          current_balance: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'cash' | 'debit' | 'credit' | 'savings'
          initial_balance?: number
          current_balance?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'cash' | 'debit' | 'credit' | 'savings'
          initial_balance?: number
          current_balance?: number
          is_active?: boolean
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          date: string
          type: 'income' | 'expense' | 'transfer'
          category_id: string | null
          account_id: string
          amount: number
          description: string
          payment_method: string | null
          status: 'paid' | 'pending' | 'cancelled'
          recurring: boolean
          recurring_frequency: string | null
          tags: string[] | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          type: 'income' | 'expense' | 'transfer'
          category_id?: string | null
          account_id: string
          amount: number
          description: string
          payment_method?: string | null
          status?: 'paid' | 'pending' | 'cancelled'
          recurring?: boolean
          recurring_frequency?: string | null
          tags?: string[] | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          type?: 'income' | 'expense' | 'transfer'
          category_id?: string | null
          account_id?: string
          amount?: number
          description?: string
          payment_method?: string | null
          status?: 'paid' | 'pending' | 'cancelled'
          recurring?: boolean
          recurring_frequency?: string | null
          tags?: string[] | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category_id: string
          month: string
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          month: string
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          month?: string
          amount?: number
          created_at?: string
        }
      }
      monthly_payments: {
        Row: {
          id: string
          user_id: string
          description: string
          amount: number
          day_of_month: number
          category_id: string | null
          account_id: string | null
          is_active: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          description: string
          amount: number
          day_of_month: number
          category_id?: string | null
          account_id?: string | null
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          description?: string
          amount?: number
          day_of_month?: number
          category_id?: string | null
          account_id?: string | null
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      monthly_payment_tracking: {
        Row: {
          id: string
          payment_id: string
          period: string
          is_paid: boolean
          paid_date: string | null
          transaction_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          payment_id: string
          period: string
          is_paid?: boolean
          paid_date?: string | null
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          payment_id?: string
          period?: string
          is_paid?: boolean
          paid_date?: string | null
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_monthly_summary: {
        Args: {
          p_user_id: string
          p_month: string
        }
        Returns: {
          total_income: number
          total_expense: number
          balance: number
          savings_rate: number
        }[]
      }
      get_category_totals: {
        Args: {
          p_user_id: string
          p_month: string
        }
        Returns: {
          category_id: string
          category_name: string
          category_type: 'income' | 'expense'
          total_amount: number
          transaction_count: number
        }[]
      }
      get_account_balances: {
        Args: {
          p_user_id: string
        }
        Returns: {
          account_id: string
          account_name: string
          account_type: 'cash' | 'debit' | 'credit' | 'savings'
          current_balance: number
        }[]
      }
      get_monthly_comparison: {
        Args: {
          p_user_id: string
          p_months?: number
        }
        Returns: {
          month: string
          total_income: number
          total_expense: number
          balance: number
        }[]
      }
      get_budget_vs_real: {
        Args: {
          p_user_id: string
          p_month: string
        }
        Returns: {
          category_id: string
          category_name: string
          budgeted_amount: number
          spent_amount: number
          remaining: number
          percentage_used: number
        }[]
      }
    }
    Enums: {
      category_type: 'income' | 'expense'
      account_type: 'cash' | 'debit' | 'credit' | 'savings'
      transaction_type: 'income' | 'expense' | 'transfer'
      transaction_status: 'paid' | 'pending' | 'cancelled'
    }
  }
}
