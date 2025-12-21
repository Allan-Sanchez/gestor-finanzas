import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  FolderOpen,
  Wallet,
  PieChart,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';
import { ThemeToggle } from '../ui';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/transactions', icon: Receipt, label: 'Transacciones' },
  { path: '/categories', icon: FolderOpen, label: 'Categorías' },
  { path: '/accounts', icon: Wallet, label: 'Cuentas' },
  { path: '/budgets', icon: PieChart, label: 'Presupuestos' },
  { path: '/reports', icon: BarChart3, label: 'Reportes' },
  { path: '/settings', icon: Settings, label: 'Configuración' },
];

export default function Sidebar() {
  const { signOut, user } = useAuth();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-gray-900 dark:bg-gray-950 text-white border-r border-gray-800 dark:border-gray-900">
      {/* Brand */}
      <div className="p-6 border-b border-gray-800 dark:border-gray-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-xl">
            💰
          </div>
          <div>
            <h1 className="font-bold text-lg">Gestor de Finanzas</h1>
            <p className="text-xs text-gray-400">Control total</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )
              }
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-800 dark:border-gray-900 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 dark:bg-gray-900">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.email}</p>
            <p className="text-xs text-gray-400">Usuario</p>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="px-4">
          <ThemeToggle />
        </div>

        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-900 hover:text-white transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
