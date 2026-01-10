import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Repeat,
  Menu,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Inicio' },
  { path: '/transactions', icon: Receipt, label: 'Transacciones' },
  { path: '/budgets', icon: PieChart, label: 'Presupuestos' },
  { path: '/monthly-payments', icon: Repeat, label: 'Pagos' },
  { path: '/more', icon: Menu, label: 'Más' },
];

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-3 px-4 flex-1 transition-colors',
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                )
              }
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
