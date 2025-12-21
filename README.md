# 💰 Gestor de Finanzas Personales

Aplicación web completa para el control y gestión de presupuesto personal, construida con React, TypeScript, Tailwind CSS y Supabase.

## ✨ Características

### Funcionalidades Principales

- **Dashboard Interactivo**
  - KPIs del mes actual (ingresos, egresos, balance, tasa de ahorro)
  - Gráficas de distribución de gastos por categoría
  - Comparativa mensual de ingresos vs egresos
  - Transacciones recientes

- **Gestión de Transacciones**
  - Registro de ingresos y egresos
  - Categorización de transacciones
  - Múltiples cuentas (efectivo, banco, tarjetas)
  - Estados (pagado, pendiente, cancelado)
  - Filtros y búsqueda

- **Categorías Personalizadas**
  - Crear categorías de ingresos y egresos
  - Iconos y colores personalizables
  - Presupuesto mensual por categoría
  - Archivar/desactivar categorías

- **Cuentas Múltiples**
  - Efectivo, débito, crédito, ahorros
  - Balance automático
  - Transferencias entre cuentas
  - Historial de movimientos

- **Presupuestos**
  - Definir presupuestos mensuales por categoría
  - Visualización de progreso
  - Alertas de sobregasto
  - Comparativa presupuesto vs real

- **Reportes y Análisis**
  - Resumen mensual
  - Comparativa mes a mes
  - Tendencias y proyecciones
  - Exportación de datos

- **Configuración Personalizada**
  - Gestión de perfil de usuario
  - Configuración de moneda predeterminada
  - Administración de datos (exportar/importar)
  - Configuración de notificaciones

- **Progressive Web App (PWA)**
  - Instalable como app nativa en móvil y escritorio
  - Funciona sin conexión (modo offline)
  - Actualizaciones automáticas
  - Cache inteligente para mejor rendimiento
  - Ver [PWA-INSTRUCTIONS.md](PWA-INSTRUCTIONS.md) para más detalles

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** con TypeScript
- **Vite 7** como build tool
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **React Query (TanStack Query)** para state management y caché
- **Recharts** para visualizaciones
- **date-fns** para manejo de fechas
- **Lucide React** para iconos
- **vite-plugin-pwa** para funcionalidad PWA

### Backend
- **Supabase** como BaaS (Backend as a Service)
  - PostgreSQL como base de datos
  - Autenticación integrada
  - Row Level Security (RLS)
  - Funciones SQL para reportes
  - Triggers automáticos

## 📋 Requisitos Previos

- Node.js 18+ y npm
- Cuenta en Supabase (gratuita)

## 🚀 Instalación y Configuración

### 1. Clonar o Navegar al Proyecto

```bash
cd gestor-finanzas
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Supabase

#### a. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que se inicialice (toma ~2 minutos)

#### b. Ejecutar el Schema SQL

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Abre el archivo `supabase-schema.sql` de este proyecto
3. Copia todo el contenido y pégalo en el editor SQL
4. Haz clic en **Run** para ejecutar el script
5. Verifica que todas las tablas se crearon correctamente en **Table Editor**

#### c. (Opcional) Ejecutar Seed de Datos

1. En el SQL Editor, abre el archivo `supabase-seed.sql`
2. **IMPORTANTE**: El script usa `auth.uid()` para obtener tu ID de usuario
3. Primero debes registrarte en la aplicación (ver paso 5)
4. Luego ejecuta el script de seed para poblar datos de ejemplo

### 4. Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Abre el archivo `.env` y configura las credenciales:

```env
# Supabase Configuration
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima

# Application Configuration
VITE_APP_NAME="Gestor de Finanzas"
VITE_DEFAULT_CURRENCY=GTQ
```

**¿Dónde encuentro las credenciales de Supabase?**
- Ve a tu proyecto en Supabase
- Haz clic en **Settings** (⚙️) → **API**
- Copia el **Project URL** → `VITE_SUPABASE_URL`
- Copia el **anon/public key** → `VITE_SUPABASE_ANON_KEY`

**Configuración de la aplicación:**
- `VITE_APP_NAME`: Nombre de tu aplicación
- `VITE_DEFAULT_CURRENCY`: Código de moneda (GTQ, USD, EUR, etc.)

### 5. Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 6. Crear tu Cuenta

1. Abre la aplicación en el navegador
2. Haz clic en **Regístrate**
3. Completa el formulario con:
   - Nombre completo
   - Correo electrónico
   - Contraseña (mínimo 6 caracteres)
4. **Verifica tu correo** (revisa tu bandeja de entrada y spam)
5. Una vez verificado, inicia sesión

### 7. (Opcional) Cargar Datos de Ejemplo

Si quieres tener datos de ejemplo para explorar la aplicación:

1. Inicia sesión en la aplicación
2. Ve al SQL Editor de Supabase
3. Ejecuta el archivo `supabase-seed.sql`
4. Esto creará:
   - Categorías de ingresos y egresos
   - Cuentas de ejemplo
   - Transacciones de los últimos 3 meses
   - Presupuestos para el mes actual

## 📖 Documentación Adicional

- **[Manual de Usuario](MANUAL-USUARIO.md)** - Guía completa para usuarios nuevos que explica paso a paso cómo usar la aplicación
- **[Instrucciones PWA](PWA-INSTRUCTIONS.md)** - Cómo instalar la aplicación como app nativa en tu dispositivo

## 📁 Estructura del Proyecto

```
gestor-finanzas/
├── src/
│   ├── components/
│   │   ├── auth/           # Componentes de autenticación
│   │   ├── dashboard/      # Componentes del dashboard
│   │   ├── transactions/   # Componentes de transacciones
│   │   ├── categories/     # Componentes de categorías
│   │   ├── accounts/       # Componentes de cuentas
│   │   ├── budgets/        # Componentes de presupuestos
│   │   ├── reports/        # Componentes de reportes
│   │   ├── settings/       # Componentes de configuración
│   │   ├── layout/         # Layout y navegación
│   │   ├── ui/             # Componentes UI reutilizables
│   │   └── PWAUpdatePrompt.tsx  # Notificación de actualizaciones PWA
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Configuración (Supabase)
│   ├── pages/              # Páginas principales
│   ├── types/              # Tipos de TypeScript
│   ├── utils/              # Funciones de utilidad
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Punto de entrada
├── public/                 # Recursos estáticos y PWA
│   ├── pwa-*.png           # Iconos PWA
│   ├── manifest-icon.svg   # Icono fuente
│   └── netlify.toml        # Configuración Netlify
├── supabase-schema.sql     # Schema de la base de datos
├── supabase-seed.sql       # Datos de ejemplo
├── supabase-fix-user.sql   # Script para corrección de usuarios
├── .env                    # Variables de entorno (no commitear)
├── .env.example            # Ejemplo de variables
├── README.md               # Documentación técnica
├── MANUAL-USUARIO.md       # Manual completo para usuarios
└── PWA-INSTRUCTIONS.md     # Guía de instalación PWA
```

## 🗄️ Esquema de Base de Datos

### Tablas Principales

1. **users** - Perfiles de usuario extendidos
2. **categories** - Categorías de ingresos y egresos
3. **accounts** - Cuentas bancarias y efectivo
4. **transactions** - Registro de transacciones
5. **budgets** - Presupuestos mensuales por categoría

### Funciones RPC Disponibles

- `get_monthly_summary(user_id, month)` - Resumen del mes
- `get_category_totals(user_id, month)` - Totales por categoría
- `get_account_balances(user_id)` - Balances de cuentas
- `get_monthly_comparison(user_id, months)` - Comparativa mensual
- `get_budget_vs_real(user_id, month)` - Presupuesto vs real

## 🔒 Seguridad

- **Row Level Security (RLS)** habilitado en todas las tablas
- Cada usuario solo puede ver y modificar sus propios datos
- Autenticación mediante Supabase Auth
- Variables de entorno para credenciales sensibles
- Validación de datos en cliente y servidor

## 🎨 Personalización

### Cambiar Moneda

Edita el archivo `.env`:
```env
VITE_DEFAULT_CURRENCY=GTQ  # o la moneda que prefieras (USD, EUR, MXN, etc.)
```

**Nota:** La moneda también puede configurarse desde la sección de Configuración en la aplicación.

### Cambiar Colores

Los colores principales se definen en `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      income: '#10B981',   // Verde para ingresos
      expense: '#EF4444',  // Rojo para egresos
      balance: '#3B82F6',  // Azul para balance
    },
  },
}
```

## 📱 Responsive Design

La aplicación está optimizada para:
- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)

**Navegación:**
- Mobile: Barra inferior
- Desktop: Sidebar lateral

## 🚀 Deployment

### Vercel (Recomendado para Frontend)

1. Sube tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Configura las variables de entorno en Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy automático

### Netlify

1. Sube tu código a GitHub
2. Conecta el repositorio en [Netlify](https://netlify.com)
3. Configura el build:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Configura las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_NAME`
   - `VITE_DEFAULT_CURRENCY`
5. El archivo `public/netlify.toml` ya incluye la configuración de redirects para SPA routing

## 🐛 Troubleshooting

### Error: "Missing Supabase credentials"
- Verifica que el archivo `.env` existe y tiene las variables correctas
- Asegúrate de que las credenciales sean válidas

### Error al ejecutar el schema SQL
- Verifica que tu proyecto de Supabase esté completamente inicializado
- Ejecuta el script completo de una sola vez
- Revisa que no haya errores en la consola SQL

### La autenticación no funciona
- Verifica que la URL de Supabase sea correcta
- Revisa que el email esté verificado
- Comprueba la configuración de autenticación en Supabase Dashboard

### Los gráficos no cargan
- Verifica que tengas transacciones en la base de datos
- Comprueba la consola del navegador por errores
- Asegúrate de que las funciones RPC estén creadas correctamente

### Error: Usuario sin perfil o datos no se cargan
Si después de registrarte los datos no se cargan correctamente:
1. Ve al SQL Editor de Supabase
2. Ejecuta el archivo `supabase-fix-user.sql`
3. Este script crea perfiles faltantes para usuarios existentes
4. Cierra sesión y vuelve a iniciar sesión

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ para ayudarte a tener un mejor control de tus finanzas personales.

## 🙏 Agradecimientos

- [Supabase](https://supabase.com) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [Recharts](https://recharts.org) - Librería de gráficos
- [Lucide](https://lucide.dev) - Iconos

---

**¡Comienza a gestionar tus finanzas de manera inteligente! 💰📊**
