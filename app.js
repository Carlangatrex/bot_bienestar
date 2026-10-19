const chat = document.getElementById('chat');
const input = document.getElementById('input');
const enviar = document.getElementById('enviar');
const mic = document.getElementById('mic');
const speaker = document.getElementById('speaker');
const dlg = document.getElementById('ayuda');
const colas = {};

let arquetipoActual = 'calido';
let síntesis = window.speechSynthesis;
let reconocimiento = null;
let escuchando = false;
let vocesDisponibles = [];
let vozSeleccionada = null;
let hablando = false;

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

function scroll() { chat.scrollTop = chat.scrollHeight; }

function mensajeBot(texto, arquetipo) {
  const b = el('div', 'msg bot');
  if (arquetipo) b.style.setProperty('--c', ARQUETIPOS.find(a => a.id === arquetipo)?.color || 'var(--bar)');
  b.append(el('div', '', texto));
  chat.appendChild(b);
  scroll();
  if (síntesis && !hablando) hablar(texto, arquetipo);
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

function responder(arquetipo) {
  const empatia = siguiente(EMPATIA[arquetipo] || EMPATIA.calido, 'empatia_' + arquetipo);
  mensajeBot(empatia, arquetipo);
}

function iniciar() {
  chat.replaceChildren();
  const bienvenida = el('div', 'msg bot');
  bienvenida.style.setProperty('--c', 'var(--bar)');
  bienvenida.append(el('div', '', 'Hola. Soy tu acompañante. ¿Cómo te sientes hoy?'));
  chat.appendChild(bienvenida);
  scroll();
  input.focus();
}

function cargarVoces() {
  vocesDisponibles = síntesis.getVoices();
  // Priorizar voces latinoamericanas (es-MX, es-419, es-CO, es-AR, es-CL, es-PE, es-VE, etc.)
  // sobre las de España (es-ES)
  const latamLangs = ['es-MX', 'es-419', 'es-CO', 'es-AR', 'es-CL', 'es-PE', 'es-VE', 'es-GT', 'es-EC', 'es-BO', 'es-CU', 'es-DO', 'es-HN', 'es-NI', 'es-PA', 'es-PR', 'es-PY', 'es-SV', 'es-UY'];
  
  // Voces preferidas por nombre (Google Latam, Microsoft Latam, Apple Latam) - priorizando voces femeninas
  const preferidasLatam = [
    'Google Español Latinoamericano', 'Google Spanish Latin American',
    'Microsoft Elena', 'Microsoft Laura', 'Microsoft Helena', 'Microsoft Sabina',
    'Apple Monica', 'Apple Paulina', 'Monica', 'Lucia', 'Jorge'
  ];
  
  let voz = null;
  
  // Función para detectar si una voz es femenina
  const esVozFemenina = (v) => {
    const nombre = v.name.toLowerCase();
    return nombre.includes('female') || 
           nombre.includes('mujer') || 
           nombre.includes('female1') || 
           nombre.includes('female2') ||
           nombre.includes('elena') || 
           nombre.includes('laura') || 
           nombre.includes('helena') || 
           nombre.includes('sabina') || 
           nombre.includes('monica') || 
           nombre.includes('paulina') || 
           nombre.includes('lucia') ||
           nombre.includes('cortana') ||
           nombre.includes('zira');
  };
  
  // 1. Buscar voz latinoamericana FEMENINA por nombre preferido
  for (const pref of [
    'Google Español Latinoamericano', 'Google Spanish Latin American',
    'Microsoft Elena', 'Microsoft Laura', 'Microsoft Helena',
    'Apple Monica', 'Apple Paulina', 'Lucia', 'Monica'
  ]) {
    voz = vocesDisponibles.find(v => 
      latamLangs.some(lang => v.lang.startsWith(lang)) && 
      v.name.includes(pref) && 
      esVozFemenina(v)
    );
    if (voz) break;
  }
  
  // 2. Buscar cualquier voz latinoamericana FEMENINA de calidad (Google, Microsoft, Apple)
  if (!voz) {
    voz = vocesDisponibles.find(v => 
      latamLangs.some(lang => v.lang.startsWith(lang)) && 
      (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Apple')) &&
      esVozFemenina(v)
    );
  }
  
  // 3. Cualquier voz latinoamericana FEMENINA
  if (!voz) {
    voz = vocesDisponibles.find(v => 
      latamLangs.some(lang => v.lang.startsWith(lang)) && 
      esVozFemenina(v)
    );
  }
  
  // 4. Fallback: cualquier voz latina (aunque sea masculina) que no sea local ni de España
  if (!voz) {
    voz = vocesDisponibles.find(v => 
      latamLangs.some(lang => v.lang.startsWith(lang)) && 
      !v.name.toLowerCase().includes('local')
    );
  }
  
  // 5. Fallback: cualquier voz en español que no sea "local" ni de España, preferiblemente femenina
  if (!voz) {
    voz = vocesDisponibles.find(v => 
      v.lang.startsWith('es') && 
      !v.name.toLowerCase().includes('local') &&
      !v.lang.startsWith('es-ES') &&
      esVozFemenina(v)
    );
  }
  
  // 6. Último fallback: cualquier voz en español
  if (!voz) {
    voz = vocesDisponibles.find(v => v.lang.startsWith('es'));
  }
  
  vozSeleccionada = voz;
  console.log('Voz TTS seleccionada:', vozSeleccionada?.name, vozSeleccionada?.lang, vozSeleccionada?.gender || 'desconocido');
}

function hablar(texto, arquetipo) {
  if (!síntesis) return;
  if (hablando) síntesis.cancel();
  if (!vozSeleccionada) cargarVoces();
  
  const utterance = new SpeechSynthesisUtterance(texto);
  // Usar el idioma de la voz seleccionada, o fallback a es-419
  utterance.lang = vozSeleccionada?.lang || 'es-419';
  
  // Parámetros base más naturales y cálidos
  let rate = 0.94;
  let pitch = 1.0;
  let volume = 0.95;
  
  // Ajustes sutiles por arquetipo (diferencias sutiles, no exageradas)
  if (arquetipo === 'sensible') {
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    utterance.volume = 0.93;
  } else if (arquetipo === 'directivo') {
    utterance.rate = 1.0;
    utterance.pitch = 0.97;
    utterance.volume = 0.97;
  } else {
    // Cálido / Práctico - más natural y cercano
    utterance.rate = 0.94;
    utterance.pitch = 1.0;
    utterance.volume = 0.96;
  }
  
  // Variación aleatoria mínima para evitar sonido robótico (±2%)
  const variacion = () => 1 + (Math.random() - 0.5) * 0.04;
  utterance.rate *= variacion();
  utterance.pitch *= variacion();
  
  if (vozSeleccionada) utterance.voice = vozSeleccionada;
  
  utterance.onstart = () => { hablando = true; };
  utterance.onend = () => { hablando = false; };
  síntesis.speak(utterance);
}
function cargarVocesInicial() {
  if (síntesis) {
    síntesis.onvoiceschanged = cargarVoces;
    cargarVoces();
  }
}

function iniciarReconocimiento() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    mensajeBot('Tu navegador no soporta reconocimiento de voz.', null);
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
      responder(arquetipoActual);
    }
  };

  reconocimiento.onerror = (e) => {
    console.warn('Reconocimiento error:', e.error);
    mensajeBot('No te escuché bien. Inténtalo de nuevo o escribe.', null);
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
    if (ultimo) hablar(ultimo, arquetipoActual);
  }
}

function enviarMensaje() {
  const texto = input.value.trim();
  if (!texto) return;
  mensajeUsuario(texto);
  input.value = '';
  responder(arquetipoActual);
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
  const ultimos = chat.querySelectorAll('.msg.bot');
  if (ultimos.length > 0) {
    const ultimo = ultimos[ultimos.length - 1].textContent.trim();
    if (ultimo) hablar(ultimo, arquetipoActual);
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