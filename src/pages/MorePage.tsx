import { Link, useNavigate } from 'react-router-dom';
import {
  FolderOpen,
  Wallet,
  Settings,
  ChevronRight,
  User,
  LogOut,
  RefreshCw,
  Moon,
  Sun
} from 'lucide-react';
import { Card, CardContent, Button } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { clearPWACache } from '../utils/pwa';

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
  const { signOut, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
      await signOut();
      navigate('/auth');
    }
  };

  const handleClearCache = async () => {
    if (confirm('¿Estás seguro que deseas limpiar el caché? Esto recargará la aplicación para obtener la última versión.')) {
      try {
        await clearPWACache();
      } catch (error) {
        alert('Error al limpiar el caché. Por favor, intenta nuevamente.');
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Más opciones</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
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
                      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {item.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Theme Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <Sun className="w-5 h-5 text-indigo-400" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Tema de la aplicación
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {theme === 'light' ? 'Modo claro activado' : 'Modo oscuro activado'}
              </p>
            </div>
          </div>
          <Button
            onClick={toggleTheme}
            variant="secondary"
            className="w-full"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-4 h-4 mr-2" />
                Activar modo oscuro
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 mr-2" />
                Activar modo claro
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* User Info and Logout */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {user?.email || 'Usuario'}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Gestor de Finanzas Personales
              </p>
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            variant="danger"
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>

      {/* Clear Cache */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Actualizar aplicación
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Limpia el caché y recarga la aplicación para obtener la última versión
              </p>
            </div>
          </div>
          <Button
            onClick={handleClearCache}
            variant="secondary"
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Limpiar caché y actualizar
          </Button>
        </CardContent>
      </Card>

      {/* App Version */}
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Versión 1.0.0
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
