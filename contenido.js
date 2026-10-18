// ARQUETIPOS (sin nombres, solo descriptores)
const ARQUETIPOS = [
  { id: 'calido', label: 'Cálido y empático', emoji: '🤗', color: '#e07b39', descripcion: 'Como un amigo cercano que te escucha sin juzgar' },
  { id: 'directivo', label: 'Directivo y cercano', emoji: '🧭', color: '#3a8f8f', descripcion: 'Tipo coach, te guía con pasos claros' },
  { id: 'sensible', label: 'Sensible y poético', emoji: '🌙', color: '#8b7ab8', descripcion: 'Valida tus emociones con dulzura y metáforas' },
  { id: 'practico', label: 'Práctico y orientado a acción', emoji: '🛠️', color: '#5a9bd8', descripcion: 'Enfocado en soluciones concretas y pasos siguientes' }
];

// ACTIVIDADES A ELEGIR (tarjetas, no directivas)
const ACTIVIDADES = [
  { id: 'musica', label: 'Escuchar música', emoji: '🎵', descripcion: 'Elige una playlist que te calme o anime' },
  { id: 'conversar', label: 'Conversar con alguien', emoji: '💬', descripcion: 'Llama o escribe a alguien de confianza' },
  { id: 'caminar', label: 'Salir a caminar', emoji: '🚶', descripcion: 'Un paseo corto, aunque sea 5 minutos' },
  { id: 'respirar', label: 'Ejercicio de respiración', emoji: '🫁', descripcion: 'Guía de 2 min: 4-7-8 o caja' },
  { id: 'escribir', label: 'Escribir lo que sientes', emoji: '📝', descripcion: 'Saca lo que llevas dentro al papel' },
  { id: 'agua', label: 'Beber un vaso de agua', emoji: '💧', descripcion: 'Hidratación simple, ahora mismo' },
  { id: 'ducha', label: 'Ducha tibia', emoji: '🚿', descripcion: 'Cambia la sensación física' },
  { id: 'nada', label: 'Solo estar un rato', emoji: '☁️', descripcion: 'No hacer nada, solo estar' }
];

// FRASES DE EMPATÍA (por arquetipo, sin "sé que te sientes...")
const EMPATIA = {
  calido: ['Te escucho.', 'Aquí estoy.', 'No estás solo en esto.'],
  directivo: ['Vamos paso a paso.', '¿Qué necesitas ahora?', 'Tienes más fuerza de la que crees.'],
  sensible: ['Tu dolor es válido.', 'A veces duele y basta.', 'Permítete sentirlo.'],
  practico: ['¿Qué pequeña cosa puedes hacer ahora?', 'Un paso a la vez.', '¿Qué está en tu control?']
};

// DESPEDIDAS por arquetipo
const DESPEDIDAS = {
  calido: ['Gracias por compartir. Aquí estaré cuando me necesites.', 'Cuídate. Te mereces ternura.'],
  directivo: ['Un paso a la vez. Vuelvo cuando quieras.', 'Tienes el control. Aquí estoy.'],
  sensible: ['Tu proceso es único. Respétalo.', 'La tormenta pasa. Aquí sigo.'],
  practico: ['Un paso a la vez. Aquí para lo que haga falta.', 'Acción, pausa, acción. Aquí estoy.']
};

const NO_ENTIENDO = [
  'Cuéntamelo con tus palabras.',
  '¿Cómo te sientes ahora?',
  'Estoy escuchando.'
];

const MENSAJE_FINAL = 'Gracias por confiar. Recuerda: no tienes que pasar esto solo. Aquí estoy cuando me necesites.';

// Líneas de ayuda verificadas. Para agregar un país, copia un bloque y confirma el número en una fuente oficial.
const AYUDA = [
  { pais: 'México', lineas: [['Línea de la Vida (24 h, gratuita)', '800 911 2000'], ['Emergencias', '911']] },
  { pais: 'España', lineas: [['Línea 024, conducta suicida (24 h, gratuita)', '024'], ['Emergencias', '112']] },
  { pais: 'Colombia', lineas: [['Línea 106, salud mental (24 h, gratuita)', '106'], ['Emergencias', '123']] }
];
const AYUDA_MAS = 'https://findahelpline.com/es-419';