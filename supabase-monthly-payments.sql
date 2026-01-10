-- =====================================================
-- MIGRACIÓN: Sistema de Pagos Mensuales Recurrentes
-- Fecha: 2026-01-10
-- Descripción: Tablas para tracking de pagos mensuales
-- =====================================================

-- =====================================================
-- TABLA 1: monthly_payments
-- Plantillas de pagos mensuales (Netflix, Spotify, etc.)
-- =====================================================

CREATE TABLE IF NOT EXISTS monthly_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Información del pago
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  day_of_month INT NOT NULL CHECK (day_of_month >= 1 AND day_of_month <= 31),

  -- Relaciones
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,

  -- Control
  is_active BOOLEAN DEFAULT true,
  notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comentarios descriptivos
COMMENT ON TABLE monthly_payments IS 'Plantillas de pagos mensuales recurrentes (ej: Netflix, Spotify, Alquiler)';
COMMENT ON COLUMN monthly_payments.description IS 'Nombre del pago (ej: Netflix Premium, Spotify)';
COMMENT ON COLUMN monthly_payments.amount IS 'Monto del pago mensual';
COMMENT ON COLUMN monthly_payments.day_of_month IS 'Día del mes en que vence el pago (1-31)';
COMMENT ON COLUMN monthly_payments.is_active IS 'Si está activo, aparece en la lista mensual';

-- =====================================================
-- TABLA 2: monthly_payment_tracking
-- Tracking mensual de pagos (¿ya pagué este mes?)
-- =====================================================

CREATE TABLE IF NOT EXISTS monthly_payment_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES monthly_payments(id) ON DELETE CASCADE,

  -- Periodo y estado
  period VARCHAR(7) NOT NULL, -- Formato: '2026-01'
  is_paid BOOLEAN DEFAULT false,
  paid_date DATE,

  -- Vinculación con transacción (comunicación bidireccional)
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Constraint: Un pago solo puede tener un tracking por mes
  UNIQUE(payment_id, period)
);

-- Comentarios descriptivos
COMMENT ON TABLE monthly_payment_tracking IS 'Tracking mensual de pagos (si ya se pagó o no en cada mes)';
COMMENT ON COLUMN monthly_payment_tracking.period IS 'Periodo mensual en formato YYYY-MM (ej: 2026-01)';
COMMENT ON COLUMN monthly_payment_tracking.is_paid IS 'Si el pago ya fue realizado este mes';
COMMENT ON COLUMN monthly_payment_tracking.transaction_id IS 'Transacción vinculada (si se creó desde Transacciones)';

-- =====================================================
-- ÍNDICES para Performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_monthly_payments_user ON monthly_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_payments_active ON monthly_payments(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_monthly_payments_category ON monthly_payments(category_id);

CREATE INDEX IF NOT EXISTS idx_tracking_payment ON monthly_payment_tracking(payment_id);
CREATE INDEX IF NOT EXISTS idx_tracking_period ON monthly_payment_tracking(period);
CREATE INDEX IF NOT EXISTS idx_tracking_pending ON monthly_payment_tracking(is_paid) WHERE is_paid = false;
CREATE INDEX IF NOT EXISTS idx_tracking_transaction ON monthly_payment_tracking(transaction_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS
ALTER TABLE monthly_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_payment_tracking ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICIES para monthly_payments
-- =====================================================

-- Policy: Ver propios pagos
CREATE POLICY "Users can view own payments" ON monthly_payments
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Insertar propios pagos
CREATE POLICY "Users can insert own payments" ON monthly_payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Actualizar propios pagos
CREATE POLICY "Users can update own payments" ON monthly_payments
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Eliminar propios pagos
CREATE POLICY "Users can delete own payments" ON monthly_payments
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- POLICIES para monthly_payment_tracking
-- =====================================================

-- Policy: Ver propio tracking
CREATE POLICY "Users can view own tracking" ON monthly_payment_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM monthly_payments mp
      WHERE mp.id = monthly_payment_tracking.payment_id
      AND mp.user_id = auth.uid()
    )
  );

-- Policy: Insertar propio tracking
CREATE POLICY "Users can insert own tracking" ON monthly_payment_tracking
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM monthly_payments mp
      WHERE mp.id = monthly_payment_tracking.payment_id
      AND mp.user_id = auth.uid()
    )
  );

-- Policy: Actualizar propio tracking
CREATE POLICY "Users can update own tracking" ON monthly_payment_tracking
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM monthly_payments mp
      WHERE mp.id = monthly_payment_tracking.payment_id
      AND mp.user_id = auth.uid()
    )
  );

-- Policy: Eliminar propio tracking
CREATE POLICY "Users can delete own tracking" ON monthly_payment_tracking
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM monthly_payments mp
      WHERE mp.id = monthly_payment_tracking.payment_id
      AND mp.user_id = auth.uid()
    )
  );

-- =====================================================
-- TRIGGERS para updated_at
-- =====================================================

-- Trigger para monthly_payments
CREATE TRIGGER update_monthly_payments_updated_at
  BEFORE UPDATE ON monthly_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para monthly_payment_tracking
CREATE TRIGGER update_tracking_updated_at
  BEFORE UPDATE ON monthly_payment_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar que las tablas se crearon correctamente
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'monthly_payments') THEN
    RAISE NOTICE '✓ Tabla monthly_payments creada exitosamente';
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'monthly_payment_tracking') THEN
    RAISE NOTICE '✓ Tabla monthly_payment_tracking creada exitosamente';
  END IF;
END $$;

-- =====================================================
-- FIN DE MIGRACIÓN
-- =====================================================
