-- =====================================================
-- GESTOR DE FINANZAS PERSONALES - SCHEMA SQL COMPLETO
-- Supabase/PostgreSQL
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABLA: users (extendida de auth.users)
-- =====================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  currency TEXT DEFAULT 'GTQ',
  default_budget_month NUMERIC(12, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para users
CREATE INDEX idx_users_id ON public.users(id);

-- =====================================================
-- 2. TABLA: categories
-- =====================================================
CREATE TYPE category_type AS ENUM ('income', 'expense');

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type category_type NOT NULL,
  icon TEXT, -- emoji o nombre de icono
  color TEXT, -- hex color
  monthly_budget NUMERIC(12, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para categories
CREATE INDEX idx_categories_user_id ON public.categories(user_id);
CREATE INDEX idx_categories_type ON public.categories(type);
CREATE INDEX idx_categories_is_active ON public.categories(is_active);

-- =====================================================
-- 3. TABLA: accounts
-- =====================================================
CREATE TYPE account_type AS ENUM ('cash', 'debit', 'credit', 'savings');

CREATE TABLE public.accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type account_type NOT NULL,
  initial_balance NUMERIC(12, 2) DEFAULT 0,
  current_balance NUMERIC(12, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para accounts
CREATE INDEX idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX idx_accounts_is_active ON public.accounts(is_active);

-- =====================================================
-- 4. TABLA: transactions
-- =====================================================
CREATE TYPE transaction_type AS ENUM ('income', 'expense', 'transfer');
CREATE TYPE transaction_status AS ENUM ('paid', 'pending', 'cancelled');

CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type transaction_type NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  payment_method TEXT,
  status transaction_status DEFAULT 'paid',
  recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency TEXT, -- 'monthly', 'weekly', 'yearly'
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para transactions
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX idx_transactions_account_id ON public.transactions(account_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, date DESC);

-- =====================================================
-- 5. TABLA: budgets
-- =====================================================
CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  month DATE NOT NULL, -- primer día del mes
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category_id, month)
);

-- Índices para budgets
CREATE INDEX idx_budgets_user_id ON public.budgets(user_id);
CREATE INDEX idx_budgets_category_id ON public.budgets(category_id);
CREATE INDEX idx_budgets_month ON public.budgets(month);
CREATE INDEX idx_budgets_user_month ON public.budgets(user_id, month);

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Políticas para categories
CREATE POLICY "Users can view own categories"
  ON public.categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON public.categories FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para accounts
CREATE POLICY "Users can view own accounts"
  ON public.accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts"
  ON public.accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts"
  ON public.accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts"
  ON public.accounts FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para transactions
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON public.transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para budgets
CREATE POLICY "Users can view own budgets"
  ON public.budgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets"
  ON public.budgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets"
  ON public.budgets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets"
  ON public.budgets FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 7. FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar balance de cuenta después de una transacción
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
DECLARE
  balance_change NUMERIC;
BEGIN
  -- Calcular el cambio en el balance
  IF TG_OP = 'INSERT' THEN
    IF NEW.type = 'income' THEN
      balance_change := NEW.amount;
    ELSIF NEW.type = 'expense' THEN
      balance_change := -NEW.amount;
    ELSE -- transfer
      balance_change := 0; -- Los transfers se manejan separadamente
    END IF;

    IF NEW.status = 'paid' THEN
      UPDATE public.accounts
      SET current_balance = current_balance + balance_change
      WHERE id = NEW.account_id;
    END IF;

  ELSIF TG_OP = 'UPDATE' THEN
    -- Si cambió el monto, el tipo o el estado
    IF OLD.amount != NEW.amount OR OLD.type != NEW.type OR OLD.status != NEW.status THEN
      -- Revertir el cambio anterior
      IF OLD.status = 'paid' THEN
        IF OLD.type = 'income' THEN
          UPDATE public.accounts
          SET current_balance = current_balance - OLD.amount
          WHERE id = OLD.account_id;
        ELSIF OLD.type = 'expense' THEN
          UPDATE public.accounts
          SET current_balance = current_balance + OLD.amount
          WHERE id = OLD.account_id;
        END IF;
      END IF;

      -- Aplicar el nuevo cambio
      IF NEW.status = 'paid' THEN
        IF NEW.type = 'income' THEN
          UPDATE public.accounts
          SET current_balance = current_balance + NEW.amount
          WHERE id = NEW.account_id;
        ELSIF NEW.type = 'expense' THEN
          UPDATE public.accounts
          SET current_balance = current_balance - NEW.amount
          WHERE id = NEW.account_id;
        END IF;
      END IF;
    END IF;

  ELSIF TG_OP = 'DELETE' THEN
    -- Revertir el cambio al eliminar
    IF OLD.status = 'paid' THEN
      IF OLD.type = 'income' THEN
        UPDATE public.accounts
        SET current_balance = current_balance - OLD.amount
        WHERE id = OLD.account_id;
      ELSIF OLD.type = 'expense' THEN
        UPDATE public.accounts
        SET current_balance = current_balance + OLD.amount
        WHERE id = OLD.account_id;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar balance de cuenta
CREATE TRIGGER trigger_update_account_balance
  AFTER INSERT OR UPDATE OR DELETE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_account_balance();

-- =====================================================
-- 8. FUNCIONES DE REPORTES Y ANÁLISIS
-- =====================================================

-- Función: Resumen mensual de ingresos, egresos y balance
CREATE OR REPLACE FUNCTION get_monthly_summary(
  p_user_id UUID,
  p_month DATE
)
RETURNS TABLE (
  total_income NUMERIC,
  total_expense NUMERIC,
  balance NUMERIC,
  savings_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN type = 'income' AND status = 'paid' THEN amount ELSE 0 END), 0) as total_income,
    COALESCE(SUM(CASE WHEN type = 'expense' AND status = 'paid' THEN amount ELSE 0 END), 0) as total_expense,
    COALESCE(SUM(CASE
      WHEN type = 'income' AND status = 'paid' THEN amount
      WHEN type = 'expense' AND status = 'paid' THEN -amount
      ELSE 0
    END), 0) as balance,
    CASE
      WHEN SUM(CASE WHEN type = 'income' AND status = 'paid' THEN amount ELSE 0 END) > 0
      THEN (SUM(CASE
        WHEN type = 'income' AND status = 'paid' THEN amount
        WHEN type = 'expense' AND status = 'paid' THEN -amount
        ELSE 0
      END) /
            SUM(CASE WHEN type = 'income' AND status = 'paid' THEN amount ELSE 0 END)) * 100
      ELSE 0
    END as savings_rate
  FROM public.transactions
  WHERE user_id = p_user_id
    AND date >= DATE_TRUNC('month', p_month)
    AND date < DATE_TRUNC('month', p_month) + INTERVAL '1 month';
END;
$$ LANGUAGE plpgsql;

-- Función: Totales por categoría en un mes
CREATE OR REPLACE FUNCTION get_category_totals(
  p_user_id UUID,
  p_month DATE
)
RETURNS TABLE (
  category_id UUID,
  category_name TEXT,
  category_type category_type,
  total_amount NUMERIC,
  transaction_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id as category_id,
    c.name as category_name,
    c.type as category_type,
    COALESCE(SUM(t.amount), 0) as total_amount,
    COUNT(t.id) as transaction_count
  FROM public.categories c
  LEFT JOIN public.transactions t ON t.category_id = c.id
    AND t.user_id = p_user_id
    AND t.status = 'paid'
    AND t.date >= DATE_TRUNC('month', p_month)
    AND t.date < DATE_TRUNC('month', p_month) + INTERVAL '1 month'
  WHERE c.user_id = p_user_id
    AND c.is_active = TRUE
  GROUP BY c.id, c.name, c.type
  ORDER BY total_amount DESC;
END;
$$ LANGUAGE plpgsql;

-- Función: Balance de cuentas
CREATE OR REPLACE FUNCTION get_account_balances(
  p_user_id UUID
)
RETURNS TABLE (
  account_id UUID,
  account_name TEXT,
  account_type account_type,
  current_balance NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    id as account_id,
    name as account_name,
    type as account_type,
    current_balance
  FROM public.accounts
  WHERE user_id = p_user_id
    AND is_active = TRUE
  ORDER BY name;
END;
$$ LANGUAGE plpgsql;

-- Función: Comparación mensual (últimos N meses)
CREATE OR REPLACE FUNCTION get_monthly_comparison(
  p_user_id UUID,
  p_months INT DEFAULT 6
)
RETURNS TABLE (
  month DATE,
  total_income NUMERIC,
  total_expense NUMERIC,
  balance NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE_TRUNC('month', t.date)::DATE as month,
    SUM(CASE WHEN t.type = 'income' AND t.status = 'paid' THEN t.amount ELSE 0 END) as total_income,
    SUM(CASE WHEN t.type = 'expense' AND t.status = 'paid' THEN t.amount ELSE 0 END) as total_expense,
    SUM(CASE
      WHEN t.type = 'income' AND t.status = 'paid' THEN t.amount
      WHEN t.type = 'expense' AND t.status = 'paid' THEN -t.amount
      ELSE 0
    END) as balance
  FROM public.transactions t
  WHERE t.user_id = p_user_id
    AND t.date >= DATE_TRUNC('month', CURRENT_DATE) - (p_months || ' months')::INTERVAL
  GROUP BY DATE_TRUNC('month', t.date)
  ORDER BY month DESC;
END;
$$ LANGUAGE plpgsql;

-- Función: Budget vs Real por categoría
CREATE OR REPLACE FUNCTION get_budget_vs_real(
  p_user_id UUID,
  p_month DATE
)
RETURNS TABLE (
  category_id UUID,
  category_name TEXT,
  budgeted_amount NUMERIC,
  spent_amount NUMERIC,
  remaining NUMERIC,
  percentage_used NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id as category_id,
    c.name as category_name,
    COALESCE(b.amount, 0) as budgeted_amount,
    COALESCE(SUM(t.amount), 0) as spent_amount,
    COALESCE(b.amount, 0) - COALESCE(SUM(t.amount), 0) as remaining,
    CASE
      WHEN COALESCE(b.amount, 0) > 0
      THEN (COALESCE(SUM(t.amount), 0) / b.amount) * 100
      ELSE 0
    END as percentage_used
  FROM public.categories c
  LEFT JOIN public.budgets b ON b.category_id = c.id
    AND b.user_id = p_user_id
    AND b.month = DATE_TRUNC('month', p_month)
  LEFT JOIN public.transactions t ON t.category_id = c.id
    AND t.user_id = p_user_id
    AND t.type = 'expense'
    AND t.status = 'paid'
    AND t.date >= DATE_TRUNC('month', p_month)
    AND t.date < DATE_TRUNC('month', p_month) + INTERVAL '1 month'
  WHERE c.user_id = p_user_id
    AND c.type = 'expense'
    AND c.is_active = TRUE
  GROUP BY c.id, c.name, b.amount
  ORDER BY percentage_used DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. FUNCIÓN PARA CREAR USUARIO AUTOMÁTICAMENTE
-- =====================================================

-- Trigger para crear perfil de usuario automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url, currency)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'currency', 'GTQ')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- FIN DEL SCHEMA
-- =====================================================

-- Notas de implementación:
-- 1. Este schema debe ejecutarse en el SQL Editor de Supabase
-- 2. Asegúrate de habilitar la autenticación de email en Supabase Dashboard
-- 3. Configura las URLs de redirección para auth en Supabase
-- 4. Las funciones RPC pueden llamarse desde el cliente con supabase.rpc('function_name', params)
