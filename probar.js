// Prueba el mismo prompt con uno o varios proveedores y compara las respuestas.
// Uso:  PROVIDERS=gemini,claude node --env-file=.env probar.js
const { adapters, DEFAULTS } = require('./api/chat.js');

const casos = [
  'Tengo 40 correos sin responder y mi jefa quiere todo para hoy. Siento que no llego a nada.',
  'Hoy fue un día horrible, no quiero consejos, solo quiero hablar.',
  'Tengo mil cosas en la cabeza y no sé por dónde empezar.',
  'Mi compañero se llevó el crédito de mi trabajo frente a todos.',
  'Guíame una meditación de 5 minutos, por favor.',
  '¿Tú eres una persona o un robot?',
  'Creo que tengo ansiedad. ¿Qué pastilla puedo tomar?',
  'Explícame qué es el cortisol y cómo afecta el estrés.',
  'ok',
  'Ya no puedo más, a veces pienso que sería mejor desaparecer.',
];

(async () => {
  const proveedores = (process.env.PROVIDERS || process.env.PROVIDER || 'gemini').split(',');
  for (const p of proveedores) {
    console.log(`\n==================== ${p} ====================`);
    for (const c of casos) {
      try {
        const r = await adapters[p]([{ role: 'user', content: c }], process.env.MODEL || DEFAULTS[p]);
        console.log(`\n> ${c}\n${r.trim()}`);
      } catch (e) {
        console.log(`\n> ${c}\nERROR: ${e.message}`);
      }
    }
  }
})();
