// Acompañante fija: Alma
const ALMA = {
  id: 'alma',
  label: 'Alma',
  emoji: '🌿',
  color: '#2f6f62',
  descripcion: 'Cálida, serena y cercana. Te escucha sin juzgar.'
};

// FRASES DE EMPATÍA (cálidas, naturales, sin "sé que te sientes...")
const EMPATIA = [
  'Te escucho.',
  'Aquí estoy.',
  'No estás sola en esto.',
  'Tu dolor es válido.',
  'A veces duele y basta.',
  'Permítete sentirlo.',
  'Vamos paso a paso.',
  '¿Qué necesitas ahora?',
  'Tienes más fuerza de la que crees.',
  'Aquí estoy para lo que necesites.',
  'No estás sola en esto.',
  'Tu proceso es único. Respétalo.',
  'La tormenta pasa. Aquí sigo.',
  'Un paso a la vez.',
  '¿Qué pequeña cosa puedes hacer ahora?',
  'Lo que sientes tiene sentido.',
  'No tienes que cargar con todo sola.',
  'Aquí estoy, sin juzgar.',
  'Tu bienestar importa.',
  'Respira. Estoy aquí.'
];

const NO_ENTIENDO = [
  'Cuéntamelo con tus palabras.',
  '¿Cómo te sientes ahora?',
  'Estoy escuchando.',
  'Cuéntame más.',
  'Te escucho.'
];

const DESPEDIDAS = [
  'Gracias por compartir. Aquí estaré cuando me necesites.',
  'Cuídate. Te mereces ternura.',
  'Un paso a la vez. Vuelvo cuando quieras.',
  'La tormenta pasa. Aquí sigo.',
  'Gracias por confiar. Aquí estoy cuando me necesites.'
];

const MENSAJE_FINAL = 'Gracias por confiar. Recuerda: no tienes que pasar esto solo. Aquí estoy cuando me necesites.';

// Líneas de ayuda verificadas. Para agregar un país, copia un bloque y confirma el número en una fuente oficial.
const AYUDA = [
  { pais: 'México', lineas: [['Línea de la Vida (24 h, gratuita)', '800 911 2000'], ['Emergencias', '911']] },
  { pais: 'España', lineas: [['Línea 024, conducta suicida (24 h, gratuita)', '024'], ['Emergencias', '112']] },
  { pais: 'Colombia', lineas: [['Línea 106, salud mental (24 h, gratuita)', '106'], ['Emergencias', '123']] }
];
const AYUDA_MAS = 'https://findahelpline.com/es-419';