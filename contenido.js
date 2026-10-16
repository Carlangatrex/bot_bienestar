// CONTENIDO EDITABLE: agrega, borra o cambia mensajes sin tocar el resto del código.
// Cada estado tiene un color y una lista de mensajes. "ayuda: true" muestra el enlace a líneas de ayuda.
// Los versículos están parafraseados: reemplázalos por la traducción que prefieras (ojo con los derechos de autor de cada una).
const ESTADOS = [
  {
    id: 'alegre', nombre: 'Alegre', color: '#f2b705',
    mensajes: [
      'Qué bueno que hoy se te nota la luz. Disfruta esta alegría y compártela con alguien que quieras.',
      'Los días buenos también hay que celebrarlos. Hoy date el gusto de algo pequeño que te guste.',
      'Cuando el corazón está contento, todo pesa menos. Aprovecha para agradecer una cosa buena de hoy, por pequeña que sea.',
      'Este es el día que hizo el Señor: alegrémonos en él. (Salmo 118:24)',
      'Tu alegría contagia. Hoy alguien se va a sentir mejor solo por verte sonreír.',
      'Que esta buena energía te acompañe todo el día. Te la mereces.',
      'Si hoy te sientes feliz, no hace falta explicarlo. Solo disfrútalo.',
      'Lo bueno de hoy también cuenta. Guárdalo en la memoria para los días difíciles.',
      'Que la sonrisa de hoy te acompañe hasta la noche. Y si puedes, regálasela a alguien más.',
      "Si hoy hay motivos para sonreír, guárdalos en la memoria. Mañana te van a servir de recuerdo.",
      "Una buena noticia se disfruta el doble cuando se comparte. ¿A quién se la contarías?",
      "Permítete disfrutar sin culpa. La alegría también es parte de cuidarte.",
      "Que tu risa de hoy llegue lejos.",
    ],
  },
  {
    id: 'bien', nombre: 'Bien', color: '#4caf93',
    mensajes: [
      'Qué bueno que estés bien. Un día tranquilo también es un regalo; disfrútalo sin prisa.',
      'Estar bien es un buen punto de partida. Elige hoy una cosa que te haga sentir aún mejor.',
      'Que este buen día te sirva para cargar pilas. Regálate un momento para ti.',
      'Los días normales y buenos son los que sostienen todo lo demás. Gracias por cuidarte.',
      'Si hoy estás bien, aprovecha para escribirle a alguien que quieres. Un mensaje corto le puede alegrar el día.',
      'Sigue a tu ritmo. Hoy no tienes que demostrar nada.',
      'Un día en calma es buen momento para hacer algo pequeño que habías dejado pendiente.',
      'Estar bien también se cuida: come algo rico y toma agua hoy.',
      'Qué gusto saber que hoy andas bien. Mereces días así y muchos más.',
      "Hoy puedes ir sin apuro. En un día así, cada cosa pesa menos.",
      "Aprovecha este buen momento para hacer algo que dejaste pendiente y te da gusto.",
      "Un buen día también merece una pausa para agradecer. ¿Qué fue lo mejor hasta ahora?",
      "Estás haciendo las cosas mejor de lo que crees.",
    ],
  },
  {
    id: 'cansancio', nombre: 'Cansancio', color: '#7a8cc4',
    mensajes: [
      'Si estás cansado es porque has dado mucho. Hoy permítete bajar un poco el ritmo.',
      'Toma un vaso de agua y siéntate un minuto. Lo demás puede esperar un poquito.',
      'No todo tiene que quedar hecho hoy. Elige solo lo más importante y deja lo demás para mañana.',
      'Descansar no es perder el tiempo; es lo que te permite seguir. Hoy te lo has ganado.',
      'Si puedes, estira los hombros y el cuello. El cuerpo también carga el cansancio.',
      'Jesús dijo: «Ven a mí si estás cansado de cargar tanto, y yo te daré descanso». (Mateo 11:28)',
      'Cuando el cuerpo pide pausa, escucharlo es una forma de cariño. Hoy dale ese permiso.',
      'Si hoy solo logras lo básico, ya hiciste bastante. No te compares con nadie.',
      'Una pausa corta, aunque sea mirar por la ventana un minuto, hace más de lo que parece.',
      "Si pudieras cambiar una cosa para descansar mejor, ¿cuál sería? Empieza por esa, aunque sea pequeña.",
      "Mira por la ventana un minuto y deja que la cabeza descanse de la pantalla.",
      "No estás fallando por estar cansado. Estás siendo humano.",
      "Esta noche intenta acostarte un poco más temprano. Mañana te lo vas a agradecer.",
    ],
  },
  {
    id: 'estres', nombre: 'Estrés', color: '#e58b4c',
    mensajes: [
      'Cuando todo urge, parece que nada tiene fin. Haz una lista corta y empieza solo por la primera cosa.',
      'Aléjate de la pantalla dos minutos. Toma agua, camina un poco y vuelve; verás las cosas con más calma.',
      'No tienes que poder con todo hoy. Pide ayuda con una sola tarea, aunque te cueste.',
      'Esto también va a pasar. Un paso a la vez es suficiente.',
      'Silencia las notificaciones un ratito. Te mereces unos minutos sin interrupciones.',
      'Pon tus preocupaciones en manos de Dios, porque él cuida de ti. (1 Pedro 5:7)',
      'No tienes que resolverlo todo ahora. Pregúntate cuál es lo más pequeño que puedes hacer y haz solo eso.',
      'Si hay mucho por hacer, ordénalo en tres: lo urgente, lo importante y lo que puede esperar.',
      'Levántate, cambia de postura y toma agua. A veces la mente se acomoda cuando el cuerpo se mueve un poco.',
      "Pregúntate qué es realmente urgente hoy. Casi siempre es menos de lo que parece.",
      "Si algo se complica, está bien pedir una mano. No tienes que poder solo.",
      "Levántate y cambia de lugar un momento. A veces un cambio de sitio cambia la mente.",
      "Una cosa a la vez. Cuando termines esa, pasas a la siguiente.",
    ],
  },
  {
    id: 'triste', nombre: 'Tristeza', color: '#5b8fd1', ayuda: true,
    mensajes: [
      'Está bien sentirse así. Hoy no tienes que fingir una sonrisa.',
      'Los días tristes también pasan. Haz solo una cosa amable por ti, aunque sea pequeña: un té, una canción, una ventana abierta.',
      'No tienes por qué cargar con esto en soledad. Si puedes, escríbele a alguien de confianza; a veces basta con decir «hoy no ando bien».',
      'Dios está cerca de los que tienen el corazón herido. (Salmo 34:18)',
      'Llorar también es una forma de soltar. Tómate el tiempo que necesites.',
      'Eres más fuerte de lo que crees, y no tienes que serlo todo el tiempo.',
      'Nada de lo que sientes hoy es para siempre. Los días cambian, aunque ahora no se note.',
      'Si hoy solo puedes con lo mínimo, está bien. Ir despacio también es avanzar.',
      'Permítete un rato de ternura contigo: una manta, una bebida caliente, tu música favorita.',
      "Hoy puedes ser amable contigo, igual que lo serías con un buen amigo.",
      "Sal un momento a que te dé la luz del día. A veces ayuda más de lo que parece.",
      "Tu tristeza no te hace débil; muestra que te importan las cosas.",
      "Escribe lo que sientes en un papel y déjalo ahí. A veces soltarlo ayuda a pesar menos.",
    ],
  },
  {
    id: 'mal', nombre: 'Mal', color: '#8b7ab8', ayuda: true,
    mensajes: [
      'Lamento que hoy te sientas así. Vamos de a poco: toma agua y siéntate un momento.',
      'No tienes que resolver todo hoy. Llegar al final del día ya es suficiente.',
      'Un mal día no define tu vida. Mañana es una página nueva.',
      'Dios te dice: «No tengas miedo, yo estoy contigo; te daré fuerzas y te sostendré». (Isaías 41:10)',
      'Si te pesa mucho, habla con alguien que te quiera. Compartir el peso lo hace más liviano.',
      'Hoy basta con que hagas lo que puedas. Eso ya es mucho.',
      'Los días malos no borran lo bueno que ya has vivido ni lo que viene.',
      'No estás fallando por sentirte así. Es un mal momento, no una mala vida.',
      'Por hoy, cuídate lo básico: agua, comida y un poco de descanso. Lo demás puede esperar.',
      "Los días difíciles también terminan. Aguanta un poquito más.",
      "Si hoy solo lograste levantarte y seguir, ya es muchísimo.",
      "Cuídate hoy como cuidarías a alguien a quien quieres mucho.",
      "Cuando todo se siente pesado, ayuda hacer una sola cosa sencilla: lavarte la cara, comer algo, abrir la ventana.",
    ],
  },
  {
    id: 'agradecimiento', nombre: 'Gratitud', color: '#e0a458',
    mensajes: [
      'Qué hermoso sentir gratitud. Dile hoy gracias a alguien, aunque sea con un mensaje corto.',
      'Agradecer cambia la mirada: hoy fíjate en tres cosas buenas, por pequeñas que sean.',
      'La gratitud es una de las formas más bonitas de alegría. Que te dure todo el día.',
      'Alguien en tu vida se alegraría de saber que piensas en esa persona con cariño. Hoy puede ser el día.',
      'Da gracias en todo momento, porque eso es lo que Dios quiere para ti. (1 Tesalonicenses 5:18)',
      'Un corazón agradecido hace que hasta los días difíciles pesen menos.',
      'Lo que hoy agradeces es lo que mañana te sostiene. Guárdalo bien.',
    ],
  },
  {
    id: 'motivacion', nombre: 'Motivación', color: '#e3735e',
    mensajes: [
      'Con esa energía puedes empezar por lo que más te cuesta. Hazlo primero y el resto será más fácil.',
      'No necesitas hacerlo perfecto, solo empezar. Un paso pequeño hoy vale más que un gran plan para mañana.',
      'Tu esfuerzo de hoy es una semilla. No siempre se ve enseguida, pero crece.',
      'Con la fuerza que Dios me da, puedo enfrentar lo que venga. (Filipenses 4:13)',
      'Elige una sola meta para hoy y ponle una hora. Cuando la cumplas, celébralo.',
      'Si hoy tienes ganas, aprovéchalas: tu yo de mañana te lo va a agradecer.',
      'Vas más lejos de lo que crees. Mira cuánto has avanzado hasta aquí.',
    ],
  },
  {
    id: 'enojo', nombre: 'Enojo', color: '#c4553d',
    mensajes: [
      'Es válido sentir rabia. No tienes que hacer nada con ella ahora mismo.',
      'Antes de responder o decidir algo, date unos minutos. Camina, toma agua y vuelve cuando se te baje un poco.',
      'Escribe lo que quisieras decir, pero no lo envíes todavía. A veces basta con sacarlo.',
      'El enojo suele avisar que algo te importa. Cuando estés más calmado, piensa qué es.',
      'No dejes que una mala hora arruine tu día completo. Tú decides cuánto espacio le das.',
      'Una respuesta amable calma la ira; una palabra dura la enciende. (Proverbios 15:1)',
      'Mueve el cuerpo un rato: sube escaleras, camina rápido o estírate. Ayuda a soltar la tensión.',
    ],
  },
  {
    id: 'preocupacion', nombre: 'Preocupación', color: '#9a8c5a',
    mensajes: [
      'Gran parte de lo que nos preocupa nunca llega a pasar. Hoy ocúpate solo de lo que sí puedes hacer.',
      'Anota lo que te preocupa y, al lado, una cosa pequeña que sí está en tus manos.',
      'No tienes que resolver el mañana hoy. Con el día de hoy es suficiente.',
      'No te inquietes por nada; cuéntale a Dios lo que necesitas y dale gracias. (Filipenses 4:6)',
      'Si algo te pesa, cuéntaselo a alguien de confianza. Decirlo en voz alta lo hace más pequeño.',
      'Toma agua y mira el cielo o algo verde un momento. A veces el ánimo cambia con una pausa pequeña.',
      'Lo que hoy te inquieta, más adelante será solo un recuerdo. Un paso a la vez.',
    ],
  },
  {
    id: 'soledad', nombre: 'Soledad', color: '#7fa8b8', ayuda: true,
    mensajes: [
      'Sentirse solo es más común de lo que parece, aunque pocos lo digan. No es un error tuyo.',
      'Hoy puedes dar el primer paso: escríbele a alguien con quien hace tiempo no hablas. Un simple «¿cómo estás?» abre puertas.',
      'Sal un momento a un lugar con gente, un parque o una tienda. A veces estar cerca de otros ya acompaña.',
      'Aunque no lo veas ahora, hay personas a las que les importas.',
      'Jesús prometió acompañarnos todos los días. (Mateo 28:20)',
      'Hazte compañía con algo que disfrutes: una película, una receta, una caminata. Estar contigo también puede sentirse bien.',
      'Si esta soledad pesa mucho o dura demasiado, hablarlo con alguien de confianza puede aliviarte.',
    ],
  },
  {
    id: 'confusion', nombre: 'Confusión', color: '#8e9aaf',
    mensajes: [
      'No pasa nada si hoy no tienes todo claro. Lo importante es dar el siguiente paso pequeño, no ver todo el camino.',
      'Anota tus opciones en una hoja y una ventaja de cada una. Verlo escrito ayuda a ordenar.',
      'Si hoy no sabes qué hacer, no decidas. Descansa, y mañana lo verás con la mente más clara.',
      'Pregúntale a alguien de confianza qué haría en tu lugar. No para obedecer, sino para ver otro ángulo.',
      'No tienes que tener todas las respuestas hoy. Algunas llegan solas cuando les das tiempo.',
      'Confía en Dios con todo tu corazón y no dependas solo de tu propio criterio. (Proverbios 3:5)',
      'Cuando hay mucho ruido en la cabeza, sal a caminar diez minutos sin el teléfono. Las ideas se acomodan en movimiento.',
    ],
  },
  {
    id: 'esperanza', nombre: 'Esperanza', color: '#7cb342',
    mensajes: [
      "Lo mejor todavía puede llegar. Hoy planta algo pequeño: una idea, una llamada, un paso.",
      "Las cosas cambian, y tú también. Mira cuánto has superado ya.",
      "Quienes confían en el Señor recuperan sus fuerzas. (Isaías 40:31)",
      "Después de la noche siempre llega la mañana. Hoy es un buen día para empezar de nuevo.",
      "Cree en lo que viene. Ya has superado días mucho más difíciles.",
      "Un poquito de esperanza alcanza para dar el siguiente paso.",
      "La esperanza se cuida como una planta: con paciencia y un poco de luz cada día.",
    ],
  },
];

// Frases de empatía que se agregan delante de cada mensaje para que suene más humano.
// Las que terminan en "que " se pegan directo al mensaje; en app.js se cuida la mayúscula inicial.
const EMPATIA = {
  alegre: ['Qué lindo leer eso. ', 'Me alegra mucho. ', 'Qué bueno que hoy se te nota la luz. '],
  bien: ['Me alegra que estés bien. ', 'Qué bien que hoy andas tranquilo. ', 'Qué gusto leer eso. '],
  cansancio: ['Te entiendo. ', 'Se nota que has dado mucho. ', 'Escucho lo cansado que estás. '],
  estres: ['Te entiendo, se siente pesado. ', 'Respira, vamos paso a paso. ', 'Escucho esa urgencia. '],
  triste: ['Te entiendo, pero recuerda que ', 'Lamento que hoy duela tanto. ', 'Acompaño lo que sientes. '],
  mal: ['Te entiendo. ', 'Lamento que estés pasando por esto. ', 'No estás solo en esto. '],
  agradecimiento: ['Qué lindo sentir gratitud. ', 'Me alegra leer eso. '],
  motivacion: ['Qué bueno tener esa energía. ', 'Te acompaño en ese ánimo. '],
  enojo: ['Te entiendo, la rabia también es válida. ', 'Escucho tu enojo. '],
  preocupacion: ['Te entiendo, preocuparse agota. ', 'Escucho esa inquietud. '],
  soledad: ['Te entiendo. ', 'No estás solo en esto. ', 'Acompaño esa soledad. '],
  confusion: ['Te entiendo, no tener claro todo es normal. ', 'Escucho tu confusión. '],
  esperanza: ['Qué lindo tener esperanza. ', 'Me alegra leer eso. '],
};

// Respuestas para frases de conversación que no son un estado de ánimo.
const CONVERSACION = [
  { patrones: ['hola', 'buenas', 'buenos días', 'buenos dias', 'buenas tardes', 'buenas noches', 'qué tal', 'que tal'], respuestas: [
    '¡Hola! Me alegra saludarte. Cuéntame, ¿cómo te sientes hoy?',
    '¡Hola! ¿Cómo te sientes hoy?',
  ]},
  { patrones: ['y tú', 'y tu', 'y vos', 'cómo estás tú', 'como estas tu', 'qué tal tú', 'que tal tu'], respuestas: [
    'Yo estoy aquí, con ganas de escucharte. ¿Y tú cómo sigues?',
    'Gracias por preguntar. Estoy bien, acompañándote. Cuéntame, ¿cómo sigues tú?',
  ]},
  { patrones: ['mejoraré', 'mejorare', 'mejorara', 'estará mejor', 'estara mejor', 'va a mejorar', 'todo mejorará', 'todo mejorara', 'estará bien', 'estara bien', 'todo estará bien', 'todo estara bien', 'va a estar bien', 'algún día', 'algun dia', 'saldré', 'salire', 'saldra', 'crees que', 'tú crees', 'tu crees', 'crees'], respuestas: [
    'Creo que sí. Los días cambian, y tú también. Lo que hoy pesa, con el tiempo pesa menos. Date permiso de avanzar despacio.',
    'Sí lo creo. Después de la noche siempre llega la mañana. No estás solo en esto.',
    'Puede ser. No puedo prometer fechas, pero sí decirte que no estás solo y que cada paso pequeño cuenta.',
  ]},
  { patrones: ['quién eres', 'quien eres', 'qué eres', 'que eres', 'cómo te llamas', 'como te llamas', 'qué haces', 'que haces'], respuestas: [
    'Soy tu acompañante: un espacio para escucharte y animarte. Cuéntame, ¿cómo te sientes hoy?',
    'Soy un acompañante con mensajes para tu día. ¿Cómo te sientes?',
  ]},
  { patrones: ['adiós', 'adios', 'hasta luego', 'hasta pronto', 'nos vemos', 'chao', 'bye'], respuestas: [
    'Hasta luego. Cuídate mucho.',
    'Que tengas un buen día. Aquí estaré si me necesitas.',
  ]},
  { patrones: ['qué puedes hacer', 'que puedes hacer', 'ayúdame', 'ayudame', 'ayuda'], respuestas: [
    'Estoy aquí para escucharte y darte un mensaje según cómo te sientes. Si lo que necesitas es hablar con alguien, revisa las líneas de ayuda.',
    'Puedo acompañarte y darte un mensaje para tu día. Si necesitas hablar con alguien, toca el botón de Ayuda.',
  ]},
];

// Líneas de ayuda verificadas. Para agregar un país, copia un bloque y confirma el número en una fuente oficial.
const AYUDA = [
  { pais: 'México', lineas: [['Línea de la Vida (24 h, gratuita)', '800 911 2000'], ['Emergencias', '911']] },
  { pais: 'España', lineas: [['Línea 024, conducta suicida (24 h, gratuita)', '024'], ['Emergencias', '112']] },
  { pais: 'Colombia', lineas: [['Línea 106, salud mental (24 h, gratuita)', '106'], ['Emergencias', '123']] },
];
const AYUDA_MAS = 'https://findahelpline.com/es-419';

// Mensaje con el que siempre termina la conversación (después de 5 mensajes).
const MENSAJE_FINAL = 'Gracias por compartir cómo te sientes. Recuerda que sentir es humano y pedir ayuda es valentía. No estás solo: cuida de ti, habla con alguien de confianza y, si lo necesitas, usa las líneas de ayuda. Que tengas un buen día.';

// Cuando no se entiende, se usa un mensaje corto para no cortar la conversación.
const NO_ENTIENDO = [
  'Cuéntame cómo te sientes, con tus palabras.',
  '¿Cómo estás hoy?',
  'Dime cómo te sientes.',
];
