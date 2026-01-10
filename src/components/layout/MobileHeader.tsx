import PaymentNotificationBell from '../notifications/PaymentNotificationBell';

export default function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-lg">
            💰
          </div>
          <div>
            <h1 className="font-bold text-base text-gray-900 dark:text-white">Gestor de Finanzas</h1>
          </div>
        </div>

        {/* Notification Bell */}
        <PaymentNotificationBell />
      </div>
    </header>
  );
}
