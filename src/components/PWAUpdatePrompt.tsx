import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from './ui';
import { RefreshCw, X } from 'lucide-react';

export default function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error:', error);
    },
  });

  useEffect(() => {
    if (offlineReady || needRefresh) {
      setShowPrompt(true);
    }
  }, [offlineReady, needRefresh]);

  const close = () => {
    setShowPrompt(false);
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {needRefresh ? 'Nueva versión disponible' : 'App lista para trabajar sin conexión'}
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              {needRefresh
                ? 'Hay una nueva versión de la aplicación disponible. Actualiza para obtener las últimas mejoras.'
                : 'La aplicación está lista para funcionar sin conexión.'}
            </p>
            <div className="flex gap-2">
              {needRefresh && (
                <Button
                  onClick={handleUpdate}
                  size="sm"
                  className="flex-1"
                >
                  Actualizar
                </Button>
              )}
              <Button
                onClick={close}
                variant="ghost"
                size="sm"
                className="flex-1"
              >
                {needRefresh ? 'Después' : 'Entendido'}
              </Button>
            </div>
          </div>
          <button
            onClick={close}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
