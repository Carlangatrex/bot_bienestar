// ARQUETIPOS (sin nombres, solo descriptores)
const ARQUETIPOS = [
  { id: 'calido', label: 'Cálido y empático', color: '#e07b39', descripcion: 'Como un amigo cercano que te escucha sin juzgar' },
  { id: 'directivo', label: 'Directivo y cercano', color: '#3a8f8f', descripcion: 'Tipo coach, te guía con pasos claros' },
  { id: 'sensible', label: 'Sensible y poético', color: '#8b7ab8', descripcion: 'Valida tus emociones con dulzura y metáforas' },
  { id: 'practico', label: 'Práctico y orientado a acción', color: '#5a9bd8', descripcion: 'Enfocado en soluciones concretas y pasos siguientes' }
];

// FRASES DE EMPATÍA (por arquetipo, sin "sé que te sientes...")
const EMPATIA = {
  calido: ['Te escucho.', 'Aquí estoy.', 'No estás solo en esto.'],
  directivo: ['Vamos paso a paso.', '¿Qué necesitas ahora?', 'Tienes más fuerza de la que crees.'],
  sensible: ['Tu dolor es válido.', 'A veces duele y basta.', 'Permítete sentirlo.'],
  practico: ['¿Qué pequeña cosa puedes hacer ahora?', 'Un paso a la vez.', '¿Qué está en tu control?']
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