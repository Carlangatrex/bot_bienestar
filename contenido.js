// Acompañante fija: Lorena
const ALMA = {
  id: 'lorena',
  label: 'Lorena',
  emoji: '🌿',
  color: '#2f6f62',
  descripcion: 'Cálida, serena y cercana. Te escucha sin juzgar.'
};

// Flujo de bienvenida
const BIENVENIDA_INICIAL = 'Hola. Soy Lorena, tu acompañante. Antes de empezar, ¿cómo te llamas?';

const BIENVENIDA_FINAL = [
  'Mucho gusto, {nombre}. Estoy aquí para escucharte sin juzgar. ¿Cómo te sientes hoy?',
  'Encantada de conocerte, {nombre}. Vamos a conversar con calma. ¿Cómo te sientes ahora?',
  'Hola {nombre}. Gracias por estar aquí. ¿Cómo estás hoy?'
];

// Saludos según la hora (solo si se necesita por separado)
const SALUDOS_POR_HORA = {
  mañana: [
    'Buenos días. ¿Cómo amaneciste?',
    'Buenos días. ¿Cómo te sientes al empezar el día?',
    'Buenos días. Qué bueno tenerte aquí esta mañana.'
  ],
  tarde: [
    'Buenas tardes. ¿Cómo va tu día?',
    'Buenas tardes. ¿Cómo te sientes ahora?',
    'Buenas tardes. Aquí estoy si quieres contarme algo.'
  ],
  noche: [
    'Buenas noches. ¿Cómo cerró tu día?',
    'Buenas noches. ¿Cómo te sientes antes de descansar?',
    'Buenas noches. Cuéntame si quieres desahogarte un poco.'
  ]
};

// FRASES DE EMPATÍA (cálidas, naturales, sin clichés de terapeuta)
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

// --- Respuestas conversacionales por intención ---
const RESPUESTAS = {
  crisis: [
    'Lo que me cuentas es importante y merece apoyo ahora mismo. Si estás pensando en hacerte daño, busca ayuda hoy: toca el botón de ayuda o llama a una línea de emergencia. No tienes que pasar esto a solas.',
    'Gracias por decírmelo. Esto es demasiado para llevarlo sola. Por favor busca apoyo ahora: el botón de ayuda tiene líneas gratuitas, o llama a emergencias. Yo sigo aquí contigo.'
  ],

  despedida: [
    'Gracias por estar aquí hoy, {nombre}. Cuídate mucho, ¿sí? Aquí estaré cuando quieras volver.',
    'Me alegró acompañarte, {nombre}. Ve con calma. Aquí sigo cuando me necesites.',
    'Un abrazo, {nombre}. Descansa si puedes. Aquí estaré mañana también.',
    'Cuídate, {nombre}. No tienes que poder con todo hoy. Aquí estaré.'
  ],

  gracias: [
    'De nada, de verdad, {nombre}. Me alegra que estés aquí.',
    'Gracias a ti por abrirte, {nombre}. Eso también es valentía.',
    'No hay de qué. Aquí estoy para acompañarte.',
    'Me alegra poder estar. ¿Cómo te sientes ahora?',
    'Gracias por confiarme lo que sientes.'
  ],

  disculpa: [
    'No tienes de qué disculparte. Aquí estoy contigo.',
    'No pasa nada, en serio. Tómate tu tiempo.',
    'No te disculpes. Lo que sientes merece espacio.'
  ],

  identidad: [
    'Soy Lorena, tu acompañante. No soy una persona ni un terapeuta: soy un espacio para escucharte sin juicios.',
    'Me llamo Lorena. Estoy aquí para acompañarte, no para juzgarte ni apurarte.',
    'Soy Lorena. No puedo resolverlo todo, pero sí puedo escucharte y recordarte que no estás sola.'
  ],

  mejora: [
    'Me alegra leer eso, {nombre}. Aunque sea un poquito, cuenta.',
    'Qué bueno, {nombre}. Guarda ese respiro, te lo ganaste.',
    'Me alegra. ¿Qué crees que te ayudó a sentirte así?',
    'Eso suena como un alivio. Déjate sentir esta pausa.',
    'Me alegra mucho. Sin prisa, pero vale la pena notar lo que sí está mejor.'
  ],

  malestar: [
    'Gracias por contármelo. No tienes que explicarlo todo de una vez.',
    'Lo que sientes tiene sentido. Estoy aquí, sin prisa.',
    'Siento que estés pasando por esto. ¿Quieres contarme qué fue lo que más te pesó hoy?',
    'No estás sola en esto. ¿Qué es lo que más te duele ahora mismo?',
    'A veces el día se vuelve demasiado. Aquí puedes soltarlo un poco.',
    'Te escucho. Sin juzgar, sin apurarte.',
    'Duele, y está bien decirlo. ¿Cómo lo estás llevando?',
    'Gracias por confiarme esto. ¿Qué necesitas en este momento: desahogarte o pensar juntas qué hacer?'
  ],

  saludo: [
    'Hola. Me alegra que estés aquí. ¿Cómo te sientes hoy?',
    'Hola, qué bueno leerte. ¿Cómo va tu día?',
    'Hola. Aquí estoy. ¿Cómo estás de verdad?',
    'Hola. Tómate tu tiempo. ¿Qué te trae por aquí hoy?'
  ],

  afirmacion: [
    'Te escucho. ¿Quieres contarme un poco más?',
    'Aquí estoy. Sigue cuando quieras.',
    'Vale. ¿Y cómo te hace sentir eso?',
    'Gracias por seguir aquí. ¿Qué más hay detrás de eso?',
    'Entiendo. ¿Quieres que hablemos de eso con calma?'
  ],

  negacion: [
    'Está bien. No tienes que decir que sí. ¿Cómo te sientes realmente?',
    'No pasa nada. Podemos ir a tu ritmo.',
    'Vale, lo respeto. ¿Qué sí necesitas ahora?'
  ],

  default: [
    'Te escucho. Cuéntame un poco más si quieres.',
    'Aquí estoy. ¿Qué es lo que más te ronda la cabeza?',
    'Gracias por compartirlo. ¿Cómo te sientes después de decirlo?',
    'No tienes que tenerlo todo claro. ¿Qué necesitas ahora?',
    'Estoy contigo. ¿Quieres desahogarte o que pensemos juntas en un paso pequeño?',
    'Lo que sea que traigas, tiene espacio aquí.',
    '¿Hay algo en particular que te esté pesando hoy?',
    'Tómate tu tiempo. No hay prisa por responder nada.',
    'A veces solo nombrarlo ya ayuda un poco. ¿Qué te viene a la mente?',
    'Estoy aquí, sin juzgar. ¿Qué quieres contarme?'
  ]
};

// Patrones para detectar la intención. Se evalúan en orden: el primero que coincide gana.
const PATRONES_INTENCION = [
  { intent: 'crisis', re: /\b(suicid\w*|matarme|quitarme la vida|no quiero vivir|acabar con todo|hacerme dano|desaparecer|no quiero estar aqui|no quiero seguir|no vale la pena vivir)\b/ },
  { intent: 'despedida', re: /\b(adios|chao|chau|hasta luego|nos vemos|me voy|hasta manana|buenas noches|hasta pronto)\b/ },
  { intent: 'gracias', re: /\b(gracias|agradezco|agradecid[oa]|mil gracias)\b/ },
  { intent: 'disculpa', re: /\b(perdon|perdona|disculpa|lo siento mucho|te pido perdon)\b/ },
  { intent: 'identidad', re: /\b(quien eres|como te llamas|que eres|eres (un )?(bot|robot|humana?|ia)|inteligencia artificial)\b/ },
  { intent: 'mejora', re: /\b(ya estoy mejor|me siento mejor|estoy mejor|mas tranquil[oa]|mas calmad[oa]|aliviad[oa]|me siento bien|genial|mucho mejor)\b/ },
  { intent: 'malestar', re: /\b(no me siento|me siento (muy )?mal|me siento (muy )?triste|estoy (muy )?triste|tristeza|deprimid[oa]|ansios[oa]|ansiedad|angustia|angustiad[oa]|miedo|asustad[oa]|cansad[oa]|agotad[oa]|estoy (muy )?sol[oa]|me siento (muy )?sol[oa]|soledad|llor\w*|dolor|fatal|horrible|estres\w*|preocupad[oa]|nervios\w*|desesper\w*|no puedo mas|hart[oa]|vac[ií][oa])\b/ },
  { intent: 'saludo', re: /\b(hola|buenas|buenos dias|buenas tardes|buenas noches|que tal|hey)\b/ },
  { intent: 'afirmacion', re: /\b(si|claro|ok|okay|vale|de acuerdo|sip|aja|exacto|cierto|correcto|obvio)\b/ },
  { intent: 'negacion', re: /\b(no|nel|para nada|tampoco)\b/ }
];

function normalizarTexto(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:()"'“”]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectarIntencion(texto) {
  const t = normalizarTexto(texto);
  if (!t) return 'default';
  for (const p of PATRONES_INTENCION) {
    if (p.re.test(t)) return p.intent;
  }
  return 'default';
}

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

const MENSAJE_FINAL = 'Gracias por confiar en mí. No tienes que cargar esto por tu cuenta: aquí estoy cuando quieras volver. Cuídate.';

// Mensajes de cierre cálidos (se muestran justo antes del mensaje final)
const CIERRE = [
  'Gracias por hablar conmigo, {nombre}. Me alegra que hayas estado aquí.',
  'Gracias por confiarme lo que sientes, {nombre}. Descansa si lo necesitas.',
  'Un abrazo, {nombre}. Aquí estaré cuando quieras conversar de nuevo.'
];

// Bloques de preguntas estructuradas por pasos del acompañamiento
const PREGUNTAS_PASO_1 = [
  '¿Cómo se siente tu día en este preciso instante?',
  'Este es tu espacio para soltar. ¿Qué es lo que más ha estado ocupando tu mente hoy?',
  'Si tuvieras que describir cómo te sientes hoy con una sola palabra o frase, ¿cuál sería?',
  'De todo lo que traes encima hoy, ¿por dónde te gustaría empezar a desahogarte?'
];

const PREGUNTAS_PASO_2 = [
  'Te leo. De todo esto que acabas de escribir, ¿qué es lo que sientes que te pesa más?',
  '¿Sientes que esta situación te está generando más cansancio mental o tensión en el cuerpo?',
  '¿Esto que cuentas es algo que surgió hoy o es algo que llevas guardando desde hace tiempo?',
  'Al leer tu propio mensaje, ¿qué emoción dirías que está más presente: frustración, miedo, tristeza o agotamiento?'
];

const PREGUNTAS_PASO_3 = [
  'De todo este panorama, ¿qué parte está realmente bajo tu control cambiar hoy y qué parte no depende de ti?',
  '¿Estás buscando ahora mismo desahogarte y soltar la carga, o necesitas encontrar un paso práctico?',
  '¿Qué le dirías a un buen amigo si estuviera pasando exactamente por esta misma situación?',
  'Si miras esto a una distancia de una semana o un mes, ¿qué tan grave o permanente se siente?'
];

const PREGUNTAS_PASO_4 = [
  'Haz una pausa un segundo: ¿notas alguna tensión en este momento en los hombros, el cuello o el estómago?',
  '¿Qué te ha servido en otros momentos difíciles para recuperar un poco la calma?',
  '¿Sientes que tienes a alguien cercano con quien compartir esto fuera de esta pantalla?',
  '¿Cuándo fue la última vez en el día que te detuviste a respirar o a tomar agua con calma?'
];

const PREGUNTAS_PASO_5 = [
  'Para cerrar este espacio por hoy: ¿cuál sería una acción muy pequeña que podrías hacer en las próximas horas para cuidarte?',
  'Si pudieras regalarte algo sencillo antes de terminar el día (descansar, caminar, desconectar el teléfono), ¿qué elegirías?',
  '¿Qué palabra o compromiso contigo mismo te gustaría que guardemos hoy en tu historial?',
  'De todo lo que hablamos, ¿con qué idea o sensación te gustaría quedarte para el resto de la jornada?'
];

// Líneas de ayuda verificadas. Para agregar un país, copia un bloque y confirma el número en una fuente oficial.
const AYUDA = [
  { pais: 'México', lineas: [['Línea de la Vida (24 h, gratuita)', '800 911 2000'], ['Emergencias', '911']] },
  { pais: 'España', lineas: [['Línea 024, conducta suicida (24 h, gratuita)', '024'], ['Emergencias', '112']] },
  { pais: 'Colombia', lineas: [['Línea 106, salud mental (24 h, gratuita)', '106'], ['Emergencias', '123']] }
];
const AYUDA_MAS = 'https://findahelpline.com/es-419';
