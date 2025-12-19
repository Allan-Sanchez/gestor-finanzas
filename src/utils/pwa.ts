/**
 * Limpia completamente el caché de la PWA y desregistra el service worker
 * Útil para forzar la actualización a la última versión de la aplicación
 */
export async function clearPWACache(): Promise<void> {
  try {
    // 1. Desregistrar todos los service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.unregister()));
      console.log('Service workers desregistrados');
    }

    // 2. Limpiar todos los cachés
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
      console.log('Cachés eliminados:', cacheNames);
    }

    // 3. Recargar la página para obtener la versión más reciente
    window.location.reload();
  } catch (error) {
    console.error('Error al limpiar el caché de PWA:', error);
    throw error;
  }
}
