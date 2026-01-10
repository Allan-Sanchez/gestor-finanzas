-- Migración: Agregar soporte para pagos únicos (no recurrentes)
-- Fecha: 2026-01-10

-- Agregar columnas para distinguir pagos recurrentes de únicos
ALTER TABLE monthly_payments
  ADD COLUMN is_recurring BOOLEAN DEFAULT true,
  ADD COLUMN specific_month VARCHAR(7) DEFAULT NULL;

-- Comentarios para documentación
COMMENT ON COLUMN monthly_payments.is_recurring IS 'true = aparece cada mes, false = solo en specific_month';
COMMENT ON COLUMN monthly_payments.specific_month IS 'Formato YYYY-MM. Solo se usa si is_recurring = false. Ej: 2026-01';

-- Crear índice para optimizar queries por mes específico
CREATE INDEX idx_monthly_payments_specific_month ON monthly_payments(specific_month)
  WHERE specific_month IS NOT NULL;

-- Agregar constraint: si no es recurrente, debe tener specific_month
ALTER TABLE monthly_payments
  ADD CONSTRAINT check_specific_month_for_non_recurring
  CHECK (
    (is_recurring = true AND specific_month IS NULL) OR
    (is_recurring = false AND specific_month IS NOT NULL)
  );

-- Actualizar todos los pagos existentes como recurrentes (migración segura)
UPDATE monthly_payments
SET is_recurring = true, specific_month = NULL
WHERE is_recurring IS NULL;
