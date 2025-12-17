import ProfileSettings from '../components/settings/ProfileSettings';
import CurrencySettings from '../components/settings/CurrencySettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import DataManagement from '../components/settings/DataManagement';

export default function SettingsPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Personaliza tu experiencia y gestiona tus datos</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Profile Settings */}
        <ProfileSettings />

        {/* Currency Settings */}
        <CurrencySettings />

        {/* Notification Settings */}
        <NotificationSettings />

        {/* Data Management - Full Width */}
        <div className="lg:col-span-2">
          <DataManagement />
        </div>
      </div>
    </div>
  );
}
