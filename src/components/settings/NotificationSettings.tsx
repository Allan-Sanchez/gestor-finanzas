import { useState } from 'react';
import { Bell, Save, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

interface NotificationPreferences {
  budget_alerts: boolean;
  transaction_reminders: boolean;
  weekly_summary: boolean;
  monthly_report: boolean;
}

export default function NotificationSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Get current preferences from user metadata
  const currentPreferences: NotificationPreferences = user?.user_metadata?.notification_preferences || {
    budget_alerts: true,
    transaction_reminders: true,
    weekly_summary: false,
    monthly_report: true,
  };

  const [preferences, setPreferences] = useState<NotificationPreferences>(currentPreferences);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Update auth.users metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          notification_preferences: preferences,
        }
      });

      if (authError) throw authError;

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['user'] });

      setMessage({ type: 'success', text: 'Preferencias de notificaciones actualizadas' });
    } catch (error: any) {
      console.error('Error updating notifications:', error);
      setMessage({ type: 'error', text: error.message || 'Error al actualizar las notificaciones' });
    } finally {
      setIsLoading(false);
    }
  };

  const notificationOptions = [
    {
      key: 'budget_alerts' as const,
      title: 'Alertas de Presupuesto',
      description: 'Recibe notificaciones cuando te acerques al límite de tu presupuesto'
    },
    {
      key: 'transaction_reminders' as const,
      title: 'Recordatorios de Transacciones',
      description: 'Recibe recordatorios para registrar tus gastos diarios'
    },
    {
      key: 'weekly_summary' as const,
      title: 'Resumen Semanal',
      description: 'Recibe un resumen de tus finanzas cada semana'
    },
    {
      key: 'monthly_report' as const,
      title: 'Reporte Mensual',
      description: 'Recibe un análisis detallado de tus finanzas al final de cada mes'
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Notificaciones</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Notification Options */}
        <div className="space-y-3 sm:space-y-4">
          {notificationOptions.map((option) => (
            <div key={option.key} className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{option.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{option.description}</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(option.key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-4 ${
                  preferences[option.key] ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences[option.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Las notificaciones por email están actualmente en desarrollo.
            Por ahora, estas preferencias se guardarán para uso futuro.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Preferencias
            </>
          )}
        </button>
      </form>
    </div>
  );
}
