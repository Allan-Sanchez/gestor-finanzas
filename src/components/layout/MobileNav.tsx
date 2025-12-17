import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  BarChart3,
  Menu,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Inicio' },
  { path: '/transactions', icon: Receipt, label: 'Transacciones' },
  { path: '/budgets', icon: PieChart, label: 'Presupuestos' },
  { path: '/reports', icon: BarChart3, label: 'Reportes' },
  { path: '/settings', icon: Menu, label: 'Más' },
];

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
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
                  isActive ? 'text-blue-600' : 'text-gray-600'
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
