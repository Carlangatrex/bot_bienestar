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

// --- CATEGORÍAS TEMÁTICAS ---
// Cada bloque tiene preguntas específicas. Se activa por palabra clave o selección del usuario.
const CATEGORIAS = {
  trabajo: {
    label: 'Estrés laboral y carga de trabajo',
    clave: ['trabajo', 'empleo', 'jefe', 'laboral', 'oficina', 'pendiente', 'carga', 'estrés', 'estres'],
    preguntas: [
      '¿Qué proyecto o pendiente específico es el que más te está quitando la tranquilidad hoy?',
      'De todo lo que tienes que hacer, ¿qué es lo único que verdaderamente requiere tu atención urgente hoy y qué puede esperar a mañana?',
      'De la carga que sientes en el trabajo, ¿qué parte depende 100% de ti y qué parte corresponde a decisiones o tiempos de otros?',
      'Cuando cierras la jornada laboral, ¿qué hábito o acción te ayuda a marcar el límite y dejar de pensar en el trabajo?',
      'Si pudieras delegar, posponer o decir "no" a una sola tarea esta semana para aliviar la presión, ¿cuál sería?'
    ]
  },
  cansancio: {
    label: 'Cansancio, sueño y agotamiento físico',
    clave: ['cansado', 'cansada', 'agotado', 'agotada', 'sueño', 'dormir', 'dormí', 'dormir bien', 'fatiga', 'cansancio'],
    preguntas: [
      '¿Sientes que este cansancio viene más de no haber dormido bien o de llevar mucho tiempo en estado de alerta?',
      'Haz un escaneo rápido de tu cuerpo en este momento: ¿dónde sientes acumulada la tensión (hombros, mandíbula, cuello, estómago)?',
      '¿Cuándo fue la última vez en el día que te detuviste un par de minutos a tomar agua, estirarte o simplemente no hacer nada?',
      'Si tu cuerpo pudiera hablarte en este instante, ¿qué crees que te estaría pidiendo?',
      '¿Qué pequeña modificación podrías hacer hoy en tu rutina nocturna para asegurarte un descanso un poco más reparador?'
    ]
  },
  ansiedad: {
    label: 'Ansiedad, rumiación y preocupación por el futuro',
    clave: ['ansioso', 'ansiosa', 'ansiedad', 'acelerado', 'acelerada', 'miedo', 'preocup', 'preocupación', 'preocupacion', 'rumiación', 'rumiacion', 'vueltas', 'bucle'],
    preguntas: [
      'Eso que te preocupa tanto en este momento, ¿es un problema real de hoy o una suposición sobre algo que podría pasar después?',
      'Si esa situación que te da vueltas en la cabeza ocurriera exactamente como temes, ¿con qué recursos o apoyo cuentas para hacerle frente?',
      'Pensar en esto una y otra vez en este instante, ¿te está acercando a una solución o solo te está agotando?',
      'Si miras esta misma preocupación a una distancia de un mes o un año, ¿qué tan determinante se sentirá?',
      '¿Qué actividad sencilla o manual podrías hacer durante los próximos 10 minutos para sacar a la mente del bucle de pensamientos?'
    ]
  },
  relaciones: {
    label: 'Relaciones, entorno y vínculos personales',
    clave: ['familia', 'pareja', 'pelea', 'conflicto', 'relación', 'relacion', 'amigo', 'amiga', 'convivencia', 'vínculo', 'vinculo', 'discusión', 'discusion'],
    preguntas: [
      'En esta situación con [la persona o grupo], ¿sientes que estás reaccionando a lo que pasó hoy o a una acumulación de eventos pasados?',
      '¿Sientes que has podido expresar con claridad lo que necesitas o estás esperando que la otra persona lo deduzca?',
      '¿Qué límite claro y respetuoso te ayudaría a proteger tu tranquilidad en esa relación o entorno?',
      'Si fueras un observador neutral en este conflicto, ¿qué dirías que necesita cada una de las partes para sentirse escuchada?',
      '¿Cuentas con alguien fuera de este problema a quien puedas acudir para desahogarte y recibir un consejo objetivo?'
    ]
  },
  autoexigencia: {
    label: 'Autoexigencia, culpa y frustración',
    clave: ['culpa', 'culpable', 'autoexigencia', 'exigente', 'frustración', 'frustracion', 'no puedo', 'hice mal', 'estándar', 'estandar', 'perfecto', 'perfeccion'],
    preguntas: [
      'Si un buen amigo viniera a contarte que se siente exactamente como tú te sientes hoy, ¿qué le dirías?',
      '¿Te estás juzgando por el resultado final o estás reconociendo el esfuerzo que hiciste con los recursos que tenías en ese momento?',
      '¿Qué expectativa o estándar demasiado alto te estás imponiendo hoy que te está generando este malestar?',
      '¿Qué es algo, por pequeño que sea, que sí haya salido bien hoy y que estés pasando por alto?',
      '¿Te darías permiso de fallar o de no ser perfecto en este proceso sin que eso signifique que hiciste un mal trabajo?'
    ]
  },
  desanimo: {
    label: 'Falta de motivos, desánimo y búsqueda de sentido',
    clave: ['desanimo', 'desánimo', 'motivo', 'motivos', 'apatia', 'apatía', 'estancamiento', 'vacío', 'vacio', 'nada me motiva', 'sin ganas'],
    preguntas: [
      'En este momento en que sientes que nada te motiva, ¿qué es lo mínimo tolerable que podrías hacer hoy sin exigirte de más?',
      '¿Qué actividad, pasatiempo o momento sencillo solía darte calma o alegría en el pasado que hayas abandonado últimamente?',
      'Si no tuvieras que cumplir con ninguna expectativa externa por un día entero, ¿a qué te gustaría dedicar ese tiempo?',
      '¿Qué pequeño espacio o ritual del día de hoy estuvo totalmente dedicado a tu propio bienestar?',
      'Si solo pudieras salvar una cosa positiva o un aprendizaje de esta semana, ¿cuál elegirías?'
    ]
  }
};

// Mapeo de intenciones detectadas por palabra clave a categoría
function detectarCategoria(texto) {
  const t = normalizarTexto(texto);
  for (const [key, cat] of Object.entries(CATEGORIAS)) {
    if (cat.clave.some(k => t.includes(normalizarTexto(k)))) {
      return key;
    }
  }
  return null;
}

// Líneas de ayuda verificadas. Para agregar un país, copia un bloque y confirma el número en una fuente oficial.
const AYUDA = [
  { pais: 'México', lineas: [['Línea de la Vida (24 h, gratuita)', '800 911 2000'], ['Emergencias', '911']] },
  { pais: 'España', lineas: [['Línea 024, conducta suicida (24 h, gratuita)', '024'], ['Emergencias', '112']] },
  { pais: 'Colombia', lineas: [['Línea 106, salud mental (24 h, gratuita)', '106'], ['Emergencias', '123']] }
];
const AYUDA_MAS = 'https://findahelpline.com/es-419';
