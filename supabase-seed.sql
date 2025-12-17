-- =====================================================
-- GESTOR DE FINANZAS - DATOS DE EJEMPLO (SEED)
-- =====================================================
-- INSTRUCCIONES:
-- 1. Primero regístrate en la aplicación
-- 2. Luego ejecuta este script en el SQL Editor de Supabase
-- 3. El script obtendrá automáticamente tu user_id
-- =====================================================

-- Crear función temporal para obtener el user_id
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Obtener el primer usuario registrado (o el usuario actual si está autenticado)
  SELECT COALESCE(v_user_id, (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1))
  INTO v_user_id;

  -- Verificar que tenemos un user_id
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No hay usuarios registrados. Por favor regístrate primero en la aplicación.';
  END IF;

  RAISE NOTICE 'Insertando datos para el usuario: %', v_user_id;

-- =====================================================
-- 1. CATEGORÍAS POR DEFECTO
-- =====================================================

-- Categorías de INGRESOS
INSERT INTO public.categories (user_id, name, type, icon, color, monthly_budget) VALUES
(v_user_id, 'Salario', 'income', '💼', '#10B981', NULL),
(v_user_id, 'Freelance', 'income', '💻', '#059669', NULL),
(v_user_id, 'Inversiones', 'income', '📈', '#34D399', NULL),
(v_user_id, 'Bonos', 'income', '🎁', '#6EE7B7', NULL),
(v_user_id, 'Otros Ingresos', 'income', '💰', '#A7F3D0', NULL);

-- Categorías de EGRESOS
INSERT INTO public.categories (user_id, name, type, icon, color, monthly_budget) VALUES
(v_user_id, 'Vivienda', 'expense', '🏠', '#EF4444', 3000.00),
(v_user_id, 'Alimentación', 'expense', '🍽️', '#F87171', 1500.00),
(v_user_id, 'Transporte', 'expense', '🚗', '#FB923C', 800.00),
(v_user_id, 'Servicios', 'expense', '💡', '#FBBF24', 600.00),
(v_user_id, 'Salud', 'expense', '⚕️', '#A855F7', 400.00),
(v_user_id, 'Educación', 'expense', '📚', '#8B5CF6', 500.00),
(v_user_id, 'Entretenimiento', 'expense', '🎬', '#EC4899', 300.00),
(v_user_id, 'Ropa', 'expense', '👕', '#F472B6', 200.00),
(v_user_id, 'Tecnología', 'expense', '📱', '#06B6D4', 150.00),
(v_user_id, 'Ahorro', 'expense', '🏦', '#3B82F6', 1000.00),
(v_user_id, 'Deudas', 'expense', '💳', '#DC2626', 500.00),
(v_user_id, 'Mascotas', 'expense', '🐕', '#84CC16', 100.00),
(v_user_id, 'Otros Gastos', 'expense', '📝', '#6B7280', 200.00);

-- =====================================================
-- 2. CUENTAS POR DEFECTO
-- =====================================================

INSERT INTO public.accounts (user_id, name, type, initial_balance, current_balance) VALUES
(v_user_id, 'Efectivo', 'cash', 1000.00, 1000.00),
(v_user_id, 'Banco Industrial - Cuenta de Ahorro', 'savings', 5000.00, 5000.00),
(v_user_id, 'Tarjeta de Crédito Visa', 'credit', 0.00, 0.00);

-- =====================================================
-- 3. PRESUPUESTOS PARA EL MES ACTUAL
-- =====================================================

-- Nota: Esto creará presupuestos para el mes actual
INSERT INTO public.budgets (user_id, category_id, month, amount)
SELECT
  v_user_id,
  id,
  DATE_TRUNC('month', CURRENT_DATE),
  monthly_budget
FROM public.categories
WHERE user_id = v_user_id
  AND type = 'expense'
  AND monthly_budget IS NOT NULL;

-- =====================================================
-- 4. TRANSACCIONES DE EJEMPLO (últimos 3 meses)
-- =====================================================

-- MES ACTUAL - Transacciones de diciembre 2025
INSERT INTO public.transactions (user_id, date, type, category_id, account_id, amount, description, payment_method, status) VALUES
-- Ingresos
(v_user_id, '2025-12-01', 'income',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Salario' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Banco Industrial - Cuenta de Ahorro' LIMIT 1),
  8000.00, 'Salario mensual de diciembre', 'Transferencia', 'paid'),

-- Egresos fijos
(v_user_id, '2025-12-01', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Vivienda' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Banco Industrial - Cuenta de Ahorro' LIMIT 1),
  2500.00, 'Alquiler mensual', 'Transferencia', 'paid'),

(v_user_id, '2025-12-05', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Servicios' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Banco Industrial - Cuenta de Ahorro' LIMIT 1),
  350.00, 'Electricidad', 'Transferencia', 'paid'),

(v_user_id, '2025-12-05', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Servicios' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Tarjeta de Crédito Visa' LIMIT 1),
  200.00, 'Internet y cable', 'Tarjeta', 'paid'),

(v_user_id, '2025-12-07', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Alimentación' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Efectivo' LIMIT 1),
  450.00, 'Supermercado semanal', 'Efectivo', 'paid'),

(v_user_id, '2025-12-10', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Transporte' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Efectivo' LIMIT 1),
  300.00, 'Gasolina', 'Efectivo', 'paid'),

(v_user_id, '2025-12-12', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Entretenimiento' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Tarjeta de Crédito Visa' LIMIT 1),
  150.00, 'Cine y cena', 'Tarjeta', 'paid'),

(v_user_id, '2025-12-14', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Alimentación' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Efectivo' LIMIT 1),
  420.00, 'Supermercado', 'Efectivo', 'paid'),

(v_user_id, '2025-12-15', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Salud' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Banco Industrial - Cuenta de Ahorro' LIMIT 1),
  250.00, 'Consulta médica', 'Transferencia', 'paid');

-- MES ANTERIOR (Noviembre 2025)
INSERT INTO public.transactions (user_id, date, type, category_id, account_id, amount, description, payment_method, status) VALUES
-- Ingresos
(v_user_id, '2025-11-01', 'income',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Salario' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Banco Industrial - Cuenta de Ahorro' LIMIT 1),
  8000.00, 'Salario mensual de noviembre', 'Transferencia', 'paid'),

(v_user_id, '2025-11-15', 'income',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Freelance' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Banco Industrial - Cuenta de Ahorro' LIMIT 1),
  1200.00, 'Proyecto web freelance', 'Transferencia', 'paid'),

-- Egresos
(v_user_id, '2025-11-01', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Vivienda' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Banco Industrial - Cuenta de Ahorro' LIMIT 1),
  2500.00, 'Alquiler mensual', 'Transferencia', 'paid'),

(v_user_id, '2025-11-05', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Servicios' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Banco Industrial - Cuenta de Ahorro' LIMIT 1),
  380.00, 'Electricidad', 'Transferencia', 'paid'),

(v_user_id, '2025-11-05', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Servicios' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Tarjeta de Crédito Visa' LIMIT 1),
  200.00, 'Internet y cable', 'Tarjeta', 'paid'),

(v_user_id, '2025-11-08', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Alimentación' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Efectivo' LIMIT 1),
  500.00, 'Supermercado', 'Efectivo', 'paid'),

(v_user_id, '2025-11-12', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Transporte' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Efectivo' LIMIT 1),
  280.00, 'Gasolina', 'Efectivo', 'paid'),

(v_user_id, '2025-11-15', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Alimentación' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Efectivo' LIMIT 1),
  480.00, 'Supermercado', 'Efectivo', 'paid'),

(v_user_id, '2025-11-18', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Ropa' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Tarjeta de Crédito Visa' LIMIT 1),
  350.00, 'Ropa nueva', 'Tarjeta', 'paid'),

(v_user_id, '2025-11-20', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Entretenimiento' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Efectivo' LIMIT 1),
  200.00, 'Salida con amigos', 'Efectivo', 'paid'),

(v_user_id, '2025-11-22', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Alimentación' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Efectivo' LIMIT 1),
  450.00, 'Supermercado', 'Efectivo', 'paid'),

(v_user_id, '2025-11-25', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Educación' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Banco Industrial - Cuenta de Ahorro' LIMIT 1),
  400.00, 'Curso online', 'Transferencia', 'paid'),

(v_user_id, '2025-11-28', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Ahorro' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Banco Industrial - Cuenta de Ahorro' LIMIT 1),
  1000.00, 'Ahorro mensual', 'Transferencia', 'paid');

-- MES -2 (Octubre 2025)
INSERT INTO public.transactions (user_id, date, type, category_id, account_id, amount, description, payment_method, status) VALUES
-- Ingresos
(v_user_id, '2025-10-01', 'income',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Salario' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Banco Industrial - Cuenta de Ahorro' LIMIT 1),
  8000.00, 'Salario mensual de octubre', 'Transferencia', 'paid'),

-- Egresos
(v_user_id, '2025-10-01', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Vivienda' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Banco Industrial - Cuenta de Ahorro' LIMIT 1),
  2500.00, 'Alquiler mensual', 'Transferencia', 'paid'),

(v_user_id, '2025-10-05', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Servicios' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Banco Industrial - Cuenta de Ahorro' LIMIT 1),
  360.00, 'Electricidad', 'Transferencia', 'paid'),

(v_user_id, '2025-10-05', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Servicios' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Tarjeta de Crédito Visa' LIMIT 1),
  200.00, 'Internet y cable', 'Tarjeta', 'paid'),

(v_user_id, '2025-10-10', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Alimentación' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Efectivo' LIMIT 1),
  550.00, 'Supermercado', 'Efectivo', 'paid'),

(v_user_id, '2025-10-15', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Transporte' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Efectivo' LIMIT 1),
  320.00, 'Gasolina y mantenimiento', 'Efectivo', 'paid'),

(v_user_id, '2025-10-17', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Alimentación' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Efectivo' LIMIT 1),
  470.00, 'Supermercado', 'Efectivo', 'paid'),

(v_user_id, '2025-10-20', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Tecnología' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Tarjeta de Crédito Visa' LIMIT 1),
  450.00, 'Auriculares nuevos', 'Tarjeta', 'paid'),

(v_user_id, '2025-10-24', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Alimentación' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Efectivo' LIMIT 1),
  430.00, 'Supermercado', 'Efectivo', 'paid'),

(v_user_id, '2025-10-28', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Deudas' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Banco Industrial - Cuenta de Ahorro' LIMIT 1),
  500.00, 'Pago de deuda', 'Transferencia', 'paid'),

(v_user_id, '2025-10-30', 'expense',
  (SELECT id FROM public.categories WHERE user_id = v_user_id AND name = 'Ahorro' LIMIT 1),
  (SELECT id FROM public.accounts WHERE user_id = v_user_id AND name = 'Banco Industrial - Cuenta de Ahorro' LIMIT 1),
  800.00, 'Ahorro mensual', 'Transferencia', 'paid');

  -- Mensaje de éxito
  RAISE NOTICE 'Datos de ejemplo insertados exitosamente para el usuario: %', v_user_id;
  RAISE NOTICE 'Categorías: 18 | Cuentas: 3 | Transacciones: ~30';

END $$;

-- =====================================================
-- FIN DEL SEED
-- =====================================================

-- Verificar los datos insertados:
-- SELECT * FROM public.categories WHERE user_id IN (SELECT id FROM auth.users);
-- SELECT * FROM public.accounts WHERE user_id IN (SELECT id FROM auth.users);
-- SELECT * FROM public.transactions WHERE user_id IN (SELECT id FROM auth.users) ORDER BY date DESC;
-- SELECT * FROM get_monthly_summary((SELECT id FROM auth.users LIMIT 1), CURRENT_DATE);
