# Acompañante

PWA de acompañamiento emocional. Te pregunta cómo te sientes y te responde con
un mensaje de apoyo; cuando aplica, te muestra líneas de ayuda. Funciona sin
servidor: todo el contenido está en `contenido.js`.

> **Aviso importante.** Acompañante no es un servicio médico, psicológico ni de
> emergencias. No sustituye la atención profesional. Si estás en crisis, llama a
> los servicios de emergencia de tu país o a una línea de ayuda. Revisa el
> [aviso legal](LEGAL.md) y la [política de privacidad](PRIVACY.md).

## Características

- Chat sencillo: el bot pregunta cómo te sientes y responde con un mensaje.
- Detección tolerante a errores de tipeo y faltas de tilde.
- Frases de empatía por estado de ánimo.
- Botón de ayuda con líneas de atención por país.
- Funciona sin conexión (service worker).
- Sin recopilación de datos: todo se procesa en tu dispositivo.

## Cómo usar

No necesitas instalar nada. Abre `index.html` en tu navegador o sirve la carpeta:

```bash
npx serve .
```

También puedes instalarla como app (PWA) desde el navegador.

## Estructura

- `index.html`, `app.js`, `sw.js`, `manifest.json`, `icon-*.png`: la app.
- `contenido.js`: **contenido editable** (estados, mensajes, empatía, ayuda).
- `privacidad.html`: aviso legal y privacidad en versión web.
- `LEGAL.md`, `PRIVACY.md`, `LICENSE`, `README.md`: documentación legal.

## Personalizar el contenido

Edita `contenido.js`:

- `ESTADOS`: estados de ánimo, color y mensajes.
- `EMPATIA`: frases que se agregan delante de cada mensaje.
- `CONVERSACION`: respuestas para saludos y preguntas.
- `AYUDA`: líneas de ayuda por país.
- `MENSAJE_FINAL` y `NO_ENTIENDO`.

## Contribuir

Las contribuciones son bienvenidas. Abre un *issue* o un *pull request*.

## Licencia

Código bajo licencia [MIT](LICENSE).
