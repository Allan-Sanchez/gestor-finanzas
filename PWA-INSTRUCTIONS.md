# 📱 Gestor de Finanzas Personales - PWA

Tu aplicación ahora es una **Progressive Web App (PWA)** completa que puede instalarse en cualquier dispositivo.

## ✨ Características PWA Implementadas

- ✅ **Instalable**: Puede instalarse como una app nativa en móviles y escritorio
- ✅ **Funciona sin conexión**: Cache inteligente de recursos estáticos
- ✅ **Actualizaciones automáticas**: Notifica cuando hay una nueva versión
- ✅ **Iconos adaptativos**: Iconos optimizados para todos los dispositivos
- ✅ **Cache de API**: Las consultas a Supabase se cachean para mejorar el rendimiento

## 📲 Cómo Instalar en Diferentes Dispositivos

### iPhone (Safari)

1. Abre la aplicación en Safari
2. Toca el botón de **Compartir** (icono de cuadro con flecha hacia arriba)
3. Desliza hacia abajo y toca **Agregar a la pantalla de inicio**
4. Personaliza el nombre si deseas
5. Toca **Agregar**
6. La app aparecerá en tu pantalla de inicio con el icono personalizado

### Android (Chrome)

1. Abre la aplicación en Chrome
2. Toca el menú de **opciones** (tres puntos verticales)
3. Selecciona **Agregar a pantalla de inicio** o **Instalar app**
4. Confirma la instalación
5. La app aparecerá como cualquier otra app nativa

### Escritorio (Chrome/Edge)

1. Abre la aplicación en Chrome o Edge
2. Busca el **icono de instalación** (+) en la barra de direcciones
3. Haz clic en **Instalar**
4. La app se abrirá en su propia ventana

## 🔧 Configuración PWA

La configuración de la PWA está en `vite.config.ts`:

- **Nombre**: Gestor de Finanzas Personales
- **Nombre corto**: Finanzas
- **Color del tema**: Azul (#2563eb)
- **Modo de visualización**: Standalone (pantalla completa sin navegador)
- **Orientación**: Portrait (vertical)

## 🎨 Iconos Generados

Se han generado automáticamente los siguientes iconos:

- `pwa-64x64.png` - Icono pequeño
- `pwa-192x192.png` - Icono mediano
- `pwa-512x512.png` - Icono grande
- `maskable-icon-512x512.png` - Icono adaptativo para Android
- `apple-touch-icon-180x180.png` - Icono para iOS
- `favicon.ico` - Favicon para navegadores

## 📦 Cache y Rendimiento

### Cache de Recursos Estáticos
Todos los archivos JS, CSS, HTML, imágenes y fuentes se cachean automáticamente.

### Cache de API (Supabase)
- **Estrategia**: Network First (intenta red primero, luego cache)
- **Duración**: 7 días
- **Máximo de entradas**: 100 consultas

### Actualizaciones
Cuando hay una nueva versión:
1. Se descarga automáticamente en segundo plano
2. Aparece una notificación en la app
3. El usuario puede decidir cuándo actualizar

## 🚀 Comandos de Desarrollo

```bash
# Desarrollo con PWA
npm run dev

# Build para producción con PWA
npm run build

# Preview del build de producción
npm run preview
```

## 🧪 Probar la PWA Localmente

1. Ejecuta `npm run build`
2. Ejecuta `npm run preview`
3. Abre la URL que muestra (generalmente http://localhost:4173)
4. En Chrome DevTools:
   - Ve a Application > Manifest
   - Ve a Application > Service Workers
   - Ve a Application > Cache Storage

## 📝 Notas Importantes

### Para que la PWA funcione correctamente en producción:

1. **HTTPS obligatorio**: Las PWA solo funcionan en HTTPS (excepto localhost)
2. **Service Worker**: Se registra automáticamente
3. **Manifest**: Se genera automáticamente en `/manifest.webmanifest`

### Archivos Clave:

- `vite.config.ts` - Configuración de vite-plugin-pwa
- `index.html` - Meta tags para PWA
- `src/components/PWAUpdatePrompt.tsx` - Componente de actualización
- `public/manifest-icon.svg` - Icono fuente (puedes reemplazarlo)

## 🎯 Próximos Pasos

Para producción, asegúrate de:

1. ✅ Desplegar en un servidor con HTTPS
2. ✅ Configurar correctamente las variables de entorno de Supabase
3. ✅ Probar la instalación en diferentes dispositivos
4. ⏳ Personalizar el icono SVG si lo deseas (`public/manifest-icon.svg`)
5. ⏳ Ajustar las estrategias de cache según tus necesidades

## 🔍 Solución de Problemas

### El botón de instalación no aparece
- Verifica que estés en HTTPS (o localhost)
- Asegúrate de que el service worker esté registrado
- Limpia el cache del navegador

### La app no funciona sin conexión
- Verifica que el service worker esté activo
- Revisa la consola para errores
- Comprueba Application > Cache Storage en DevTools

### Los cambios no se reflejan
- La PWA cachea agresivamente
- Usa el botón "Actualizar" cuando aparezca la notificación
- En desarrollo, deshabilita el cache en DevTools

---

¡Tu app de finanzas personales ahora es una PWA completa! 🎉
