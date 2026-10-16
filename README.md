# Acompañante

PWA de chat con IA para desahogarse y recibir un consejo práctico. Acceso por suscripción (Hotmart).

## Estructura
- `index.html`, `app.js`, `sw.js`, `manifest.json`, `icon-*.png`: la app (PWA)
- `privacy.html`: privacidad y términos (borrador: completar y revisar con un abogado)
- `api/chat.js`: conversación con la IA (elige proveedor con `PROVIDER`)
- `api/_prompt.js`: instrucciones de tono del bot
- `api/login.js`, `api/verify.js`: ingreso con código por correo
- `api/hotmart.js`: webhook de Hotmart (altas, cancelaciones, gracia)
- `api/_lib.js`: utilidades compartidas
- `probar.js`: compara proveedores con mensajes de prueba

## Despliegue (Vercel)
1. Sube este repositorio a GitHub e impórtalo en Vercel.
2. Agrega las variables de `.env.example` en *Settings → Environment Variables*.
3. En Hotmart, registra el webhook `https://TU-APP.vercel.app/api/hotmart`.

Nunca subas el archivo `.env` con claves reales.
