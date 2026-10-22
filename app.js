const chat = document.getElementById('chat');
const input = document.getElementById('input');
const enviar = document.getElementById('enviar');
const mic = document.getElementById('mic');
const speaker = document.getElementById('speaker');
const dlg = document.getElementById('ayuda');
const estado = document.getElementById('estado');
const colas = {};

let síntesis = window.speechSynthesis;
let reconocimiento = null;
let escuchando = false;
let vocesDisponibles = [];
let vozSeleccionada = null;
let hablando = false;
let ultimaRespuesta = '';
let respuestaPendiente = 0;
let interaccionesChat = 0;
let chatCerrado = false;

/* Flujo de bienvenida */
let etapaInicio = 'inicial'; // 'inicial' | 'nombre' | 'listo'
let nombreUsuario = '';

/* Flujo estructurado por pasos */
let etapaChat = null; // 'paso1' | 'paso2' | 'paso3' | 'paso4' | 'paso5' | null
let ultimaPreguntaMostrada = '';
let categoriaActiva = null; // clave de CATEGORIAS o null

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

function scroll() { chat.scrollTop = chat.scrollHeight; }

function mensajeBot(texto, autoPlay = true) {
  const b = el('div', 'msg bot');
  b.style.setProperty('--c', '#2f6f62');
  b.append(el('div', '', texto));
  chat.appendChild(b);
  scroll();
  if (autoPlay && síntesis && !hablando) hablar(texto);
}

function mensajeUsuario(texto) {
  chat.appendChild(el('div', 'msg usuario', texto));
  scroll();
}

function siguiente(arr, key) {
  if (!colas[key] || !colas[key].length) {
    colas[key] = [...arr].sort(() => Math.random() - 0.5);
  }
  return colas[key].pop();
}

function responder(textoUsuario = '') {
  const intencion = detectarIntencion(textoUsuario);

  // Detectar categoría automáticamente si no hay una activa
  if (!categoriaActiva) {
    const catDetectada = detectarCategoria(textoUsuario);
    if (catDetectada) {
      categoriaActiva = catDetectada;
    }
  }

  // Crisis siempre tiene prioridad, en cualquier paso
  if (intencion === 'crisis') {
    const banco = RESPUESTAS.crisis;
    let opciones = banco;
    if (opciones.length > 1 && ultimaRespuesta) {
      const sinRepetir = opciones.filter(r => r !== ultimaRespuesta);
      if (sinRepetir.length) opciones = sinRepetir;
    }
    const respuesta = siguiente(opciones, 'intent-crisis');
    ultimaRespuesta = respuesta;
    const textoFinal = personalizar(respuesta);
    quitarEscribiendo();
    estado.textContent = 'Activa ahora';
    mensajeBot(textoFinal);
    return;
  }

  // Si el chat ya cerró, no responder
  if (chatCerrado) return;

  // Si hay categoría activa, usar sus preguntas en orden
  if (categoriaActiva) {
    const cat = CATEGORIAS[categoriaActiva];
    const total = cat.preguntas.length;
    if (!etapaChat) etapaChat = 'cat1';

    const pasoNum = parseInt(etapaChat.replace('cat', ''), 10);
    const siguienteNum = pasoNum + 1;

    if (siguienteNum > total) {
      // Terminó todas las preguntas de la categoría: cerrar
      quitarEscribiendo();
      mensajeBot(MENSAJE_FINAL);
      cerrarChat();
      return;
    }

    etapaChat = 'cat' + siguienteNum;
    const banco = cat.preguntas;
    let opciones = banco;
    if (opciones.length > 1 && ultimaPreguntaMostrada) {
      const sinRepetir = opciones.filter(r => r !== ultimaPreguntaMostrada);
      if (sinRepetir.length) opciones = sinRepetir;
    }
    const pregunta = siguiente(opciones, 'cat-' + categoriaActiva + '-' + siguienteNum);
    ultimaPreguntaMostrada = pregunta;
    const textoFinal = personalizar(pregunta);

    const id = ++respuestaPendiente;
    mostrarEscribiendo();
    estado.textContent = 'escribiendo...';

    const espera = 550 + Math.random() * 650;
    setTimeout(() => {
      if (id !== respuestaPendiente) return;
      quitarEscribiendo();
      estado.textContent = 'Activa ahora';
      mensajeBot(textoFinal);
    }, espera);
    return;
  }

  // Flujo genérico de 5 pasos (sin categoría seleccionada)
  if (etapaChat === null) return;

  const ordenPasos = ['paso1', 'paso2', 'paso3', 'paso4', 'paso5'];
  const indiceActual = ordenPasos.indexOf(etapaChat);
  const siguienteIndice = indiceActual + 1;

  if (siguienteIndice >= ordenPasos.length) {
    quitarEscribiendo();
    mensajeBot(MENSAJE_FINAL);
    cerrarChat();
    return;
  }

  const siguientePaso = ordenPasos[siguienteIndice];
  etapaChat = siguientePaso;

  const bloques = {
    paso1: PREGUNTAS_PASO_1,
    paso2: PREGUNTAS_PASO_2,
    paso3: PREGUNTAS_PASO_3,
    paso4: PREGUNTAS_PASO_4,
    paso5: PREGUNTAS_PASO_5
  };

  const banco = bloques[siguientePaso];
  let opciones = banco;
  if (opciones.length > 1 && ultimaPreguntaMostrada) {
    const sinRepetir = opciones.filter(r => r !== ultimaPreguntaMostrada);
    if (sinRepetir.length) opciones = sinRepetir;
  }
  const pregunta = siguiente(opciones, 'pregunta-' + siguientePaso);
  ultimaPreguntaMostrada = pregunta;
  const textoFinal = personalizar(pregunta);

  const id = ++respuestaPendiente;
  mostrarEscribiendo();
  estado.textContent = 'escribiendo...';

  const espera = 550 + Math.random() * 650;
  setTimeout(() => {
    if (id !== respuestaPendiente) return;
    quitarEscribiendo();
    estado.textContent = 'Activa ahora';
    mensajeBot(textoFinal);
  }, espera);
}

function siguientePregunta(bloque, clave) {
  let opciones = bloque;
  if (opciones.length > 1 && ultimaPreguntaMostrada) {
    const sinRepetir = opciones.filter(r => r !== ultimaPreguntaMostrada);
    if (sinRepetir.length) opciones = sinRepetir;
  }
  return siguiente(opciones, clave);
}

function procesarInicio(texto) {
  if (etapaInicio === 'nombre') {
    nombreUsuario = texto.trim() || 'amigo';
    etapaInicio = 'listo';
    const textoFinal = siguiente(BIENVENIDA_FINAL, 'final').replace('{nombre}', nombreUsuario);
    mensajeBot(textoFinal);
    setTimeout(() => {
      mostrarCategorias();
    }, 900);
    return true;
  }
  return false;
}

function personalizar(texto) {
  return texto.replace('{nombre}', nombreUsuario || '');
}

function mostrarCategorias() {
  const contenedor = el('div', 'categorias');
  contenedor.style.display = 'flex';
  contenedor.style.flexDirection = 'column';
  contenedor.style.gap = '7px';
  contenedor.style.margin = '10px 0';

  const titulo = el('div', '', '¿Te gustaría elegir un tema para conversar? (o escribe libremente)');
  titulo.style.fontSize = '13px';
  titulo.style.color = 'var(--muted)';
  titulo.style.marginBottom = '6px';
  contenedor.appendChild(titulo);

  for (const [key, cat] of Object.entries(CATEGORIAS)) {
    const btn = el('button', 'btn-categoria', cat.label);
    btn.type = 'button';
    btn.addEventListener('click', () => {
      categoriaActiva = key;
      etapaChat = null;
      contenedor.remove();
      ejecutarCategoria(key);
    });
    contenedor.appendChild(btn);
  }

  const btnGeneral = el('button', 'btn-categoria', 'Conversar libremente (sin tema)');
  btnGeneral.type = 'button';
  btnGeneral.addEventListener('click', () => {
    categoriaActiva = null;
    etapaChat = 'paso1';
    contenedor.remove();
    const pregunta = siguientePregunta(PREGUNTAS_PASO_1, 'paso1');
    mensajeBot(pregunta);
  });
  contenedor.appendChild(btnGeneral);

  chat.appendChild(contenedor);
  scroll();
}

function ejecutarCategoria(categoria) {
  const cat = CATEGORIAS[categoria];
  const banco = cat.preguntas;
  let opciones = banco;
  if (opciones.length > 1 && ultimaPreguntaMostrada) {
    const sinRepetir = opciones.filter(r => r !== ultimaPreguntaMostrada);
    if (sinRepetir.length) opciones = sinRepetir;
  }
  const pregunta = siguiente(opciones, 'cat-' + categoria);
  ultimaPreguntaMostrada = pregunta;
  const textoFinal = personalizar(pregunta);

  etapaChat = 'cat1';

  const id = ++respuestaPendiente;
  mostrarEscribiendo();
  estado.textContent = 'escribiendo...';

  const espera = 550 + Math.random() * 650;
  setTimeout(() => {
    if (id !== respuestaPendiente) return;
    quitarEscribiendo();
    estado.textContent = 'Activa ahora';
    mensajeBot(textoFinal);
  }, espera);
}

function cerrarChat() {
  chatCerrado = true;
  input.disabled = true;
  input.placeholder = 'Conversación finalizada';
  enviar.style.display = 'none';
  mic.style.display = 'none';
  speaker.style.display = 'none';
  const btn = el('button', 'btn-reiniciar', 'Reiniciar conversación');
  btn.type = 'button';
  btn.onclick = () => location.reload();
  const area = document.getElementById('input-area');
  area.appendChild(btn);
}

function mostrarEscribiendo() {
  quitarEscribiendo();
  const t = el('div', 'msg bot typing');
  t.id = 'typing';
  t.setAttribute('aria-label', 'Lorena está escribiendo');
  t.append(document.createElement('span'), document.createElement('span'), document.createElement('span'));
  chat.appendChild(t);
  scroll();
}

function quitarEscribiendo() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}

function esVozFemenina(v) {
  const n = String(v?.name || '').toLowerCase();
  const gender = String(v?.gender || '').toLowerCase();
  if (gender === 'female') return true;
  return n.includes('female') || n.includes('mujer') ||
         n.includes('elena') || n.includes('laura') ||
         n.includes('helena') || n.includes('sabina') ||
         n.includes('monica') || n.includes('paulina') ||
         n.includes('lucia') || n.includes('maria') ||
         n.includes('sofia') || n.includes('isabela') ||
         n.includes('camila') || n.includes('valentina') ||
         n.includes('gabriela') || n.includes('daniela') ||
         n.includes('fernanda') || n.includes('alejandra');
}

function cargarVoces() {
  if (!síntesis) return;
  vocesDisponibles = síntesis.getVoices() || [];
  if (!vocesDisponibles.length) return;

  const langs = ['es-mx', 'es-419', 'es-co', 'es-ar', 'es-cl', 'es-pe', 'es-ve', 'es-gt', 'es-ec', 'es-bo', 'es-cu', 'es-do', 'es-hn', 'es-ni', 'es-pa', 'es-pr', 'es-py', 'es-sv', 'es-uy'];

  const puntuar = (v) => {
    const lang = String(v.lang || '').toLowerCase();
    const name = String(v.name || '').toLowerCase();
    if (!lang.startsWith('es')) return -1;
    let puntos = 0;
    if (esVozFemenina(v)) puntos += 40;
    if (langs.some(l => lang.startsWith(l))) puntos += 30;
    if (!name.includes('local')) puntos += 20;
    if (name.includes('google')) puntos += 15;
    if (name.includes('microsoft')) puntos += 10;
    if (name.includes('apple')) puntos += 5;
    if (lang.startsWith('es-es')) puntos -= 10;
    return puntos;
  };

  let mejor = null;
  let mejorPuntos = -1;
  for (const v of vocesDisponibles) {
    const p = puntuar(v);
    if (p > mejorPuntos) { mejorPuntos = p; mejor = v; }
  }

  vozSeleccionada = mejor || vocesDisponibles[0] || null;
  if (vozSeleccionada) {
    console.log('Voz TTS:', vozSeleccionada.name, vozSeleccionada.lang, vozSeleccionada.gender || '?');
  }
}

function hablar(texto) {
  if (!síntesis) return;
  if (hablando) síntesis.cancel();
  if (!vozSeleccionada) cargarVoces();

  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = vozSeleccionada?.lang || 'es-419';

  utterance.rate = 0.93;
  utterance.pitch = 1.0;
  utterance.volume = 0.97;

  const variacion = () => 1 + (Math.random() - 0.5) * 0.03;
  utterance.rate *= variacion();
  utterance.pitch *= variacion();

  if (vozSeleccionada) utterance.voice = vozSeleccionada;

  utterance.onstart = () => {
    hablando = true;
    speaker.classList.remove('mutado');
    speaker.classList.add('sonando');
  };
  utterance.onend = () => {
    hablando = false;
    speaker.classList.remove('sonando');
    speaker.classList.add('mutado');
  };
  síntesis.speak(utterance);
}

function cargarVocesInicial() {
  if (síntesis) {
    síntesis.onvoiceschanged = cargarVoces;
    cargarVoces();
  }
}

function iniciar() {
  etapaInicio = 'nombre';
  nombreUsuario = '';
  chat.replaceChildren();
  const bienvenida = el('div', 'msg bot');
  bienvenida.style.setProperty('--c', '#2f6f62');
  bienvenida.append(el('div', '', BIENVENIDA_INICIAL));
  chat.appendChild(bienvenida);
  scroll();
  input.focus();
  // No auto-play: el navegador bloquea audio sin interacción del usuario
}

function iniciarReconocimiento() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    mensajeBot('Tu navegador no soporta reconocimiento de voz.');
    return;
  }
  if (escuchando) return;
  const Reconocimiento = window.SpeechRecognition || window.webkitSpeechRecognition;
  reconocimiento = new Reconocimiento();
  reconocimiento.lang = 'es-ES';
  reconocimiento.interimResults = false;
  reconocimiento.continuous = false;

  reconocimiento.onstart = () => {
    escuchando = true;
    mic.classList.add('escuchando');
    mic.textContent = '🔴';
  };

  reconocimiento.onresult = (e) => {
    const texto = e.results[0][0].transcript.trim();
    if (texto) {
      mensajeUsuario(texto);
      if (chatCerrado) return;
      if (etapaInicio !== 'listo') {
        procesarInicio(texto);
        return;
      }
      responder(texto);
    }
  };

  reconocimiento.onerror = (e) => {
    console.warn('Reconocimiento error:', e.error);
    mensajeBot('No te escuché bien. Inténtalo de nuevo o escribe.');
  };

  reconocimiento.onend = () => {
    escuchando = false;
    mic.textContent = '🎤';
  };

  reconocimiento.start();
}

function reproducirUltimo() {
  const ultimos = chat.querySelectorAll('.msg.bot');
  if (ultimos.length > 0) {
    const ultimo = ultimos[ultimos.length - 1].textContent.trim();
    if (ultimo) hablar(ultimo);
  }
}

function enviarMensaje() {
  const texto = input.value.trim();
  if (!texto) return;
  if (chatCerrado) return;
  mensajeUsuario(texto);
  input.value = '';
  if (etapaInicio !== 'listo') {
    procesarInicio(texto);
    return;
  }
  responder(texto);
}

function enviarMensajeVoz() {
  if (escuchando) return;
  iniciarReconocimiento();
}

function toggleAyuda() { dlg.showModal(); }
function cerrarAyuda() { dlg.close(); }

// Inicialización
if ('speechSynthesis' in window) {
  síntesis = window.speechSynthesis;
  síntesis.onvoiceschanged = cargarVoces;
  cargarVoces();
}

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  mic.style.display = 'flex';
}

if ('speechSynthesis' in window) {
  speaker.style.display = 'flex';
}

enviar.addEventListener('click', enviarMensaje);
input.addEventListener('keydown', e => { if (e.key === 'Enter') enviarMensaje(); });
mic.addEventListener('click', enviarMensajeVoz);
document.getElementById('speaker').addEventListener('click', () => {
  if (hablando) {
    síntesis.cancel();
    hablando = false;
    speaker.classList.remove('sonando');
    speaker.classList.add('mutado');
    return;
  }
  const ultimos = chat.querySelectorAll('.msg.bot');
  if (ultimos.length > 0) {
    const ultimo = ultimos[ultimos.length - 1].textContent.trim();
    if (ultimo) {
      speaker.classList.remove('mutado');
      hablar(ultimo);
    }
  }
});

// Ayuda
function ayudaNode() {
  const box = document.createElement('div');
  AYUDA.forEach(c => {
    box.appendChild(el('div', 'pais', c.pais));
    c.lineas.forEach(([nombre, num]) => {
      const a = el('a', '', `${nombre}: ${num}`);
      a.href = 'tel:' + num.replace(/\s/g, '');
      box.appendChild(a);
    });
  });
  const mas = el('a', '', '¿Otro país? Busca tu línea aquí');
  mas.href = AYUDA_MAS;
  mas.target = '_blank';
  mas.rel = 'noopener';
  box.appendChild(mas);
  return box;
}

document.getElementById('ayudaLista').appendChild(ayudaNode());
document.getElementById('ayudaBtn').addEventListener('click', () => dlg.showModal());
document.getElementById('cerrar').addEventListener('click', () => dlg.close());

iniciar();
input.focus();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}