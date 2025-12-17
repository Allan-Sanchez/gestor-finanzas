import { Link } from 'react-router-dom';
import {
  FolderOpen,
  Wallet,
  Settings,
  ChevronRight,
  User,
  Bell,
  Database
} from 'lucide-react';
import { Card, CardContent } from '../components/ui';

interface MenuItem {
  path: string;
  icon: typeof FolderOpen;
  label: string;
  description: string;
  color: string;
}

const menuItems: MenuItem[] = [
  {
    path: '/categories',
    icon: FolderOpen,
    label: 'Categorías',
    description: 'Organiza tus transacciones',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    path: '/accounts',
    icon: Wallet,
    label: 'Cuentas',
    description: 'Gestiona tus cuentas bancarias',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    path: '/settings',
    icon: Settings,
    label: 'Configuración',
    description: 'Ajusta tu perfil y preferencias',
    color: 'bg-gray-100 text-gray-600',
  },
];

export default function MorePage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Más opciones</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Accede a todas las funciones de la aplicación
        </p>
      </div>

      {/* Menu Items */}
      <div className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900">
                        {item.label}
                      </h3>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Additional Info */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Gestor de Finanzas Personales
              </h4>
              <p className="text-xs text-gray-600">
                Versión 1.0.0
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
