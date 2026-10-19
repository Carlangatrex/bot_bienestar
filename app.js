const chat = document.getElementById('chat');
const input = document.getElementById('input');
const enviar = document.getElementById('enviar');
const mic = document.getElementById('mic');
const speaker = document.getElementById('speaker');
const dlg = document.getElementById('ayuda');
const colas = {};

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

function mensajeBot(texto) {
  const b = el('div', 'msg bot');
  b.style.setProperty('--c', '#2f6f62');
  b.append(el('div', '', texto));
  chat.appendChild(b);
  scroll();
  if (síntesis && !hablando) hablar(texto);
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

function responder() {
  const empatia = siguiente(EMPATIA, 'empatia');
  mensajeBot(empatia);
}

function iniciar() {
  chat.replaceChildren();
  const bienvenida = el('div', 'msg bot');
  bienvenida.style.setProperty('--c', '#2f6f62');
  bienvenida.append(el('div', '', 'Hola. Soy Alma, tu acompañante. ¿Cómo te sientes hoy?'));
  chat.appendChild(bienvenida);
  scroll();
  input.focus();
}

function esVozFemenina(nombre) {
  const n = nombre.toLowerCase();
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
  vocesDisponibles = síntesis.getVoices();
  const latamLangs = ['es-MX', 'es-419', 'es-CO', 'es-AR', 'es-CL', 'es-PE', 'es-VE', 'es-GT', 'es-EC', 'es-BO', 'es-CU', 'es-DO', 'es-HN', 'es-NI', 'es-PA', 'es-PR', 'es-PY', 'es-SV', 'es-UY'];

  const esVozFemenina = (v) => {
    const n = v.name.toLowerCase();
    const gender = (v.gender || '').toLowerCase();
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
  };

  // 1. Buscar voz latinoamericana FEMENINA de alta calidad (Google > Microsoft > Apple)
  const vocesFemeninasLatam = vocesDisponibles.filter(v => {
    const esLatam = ['es-MX', 'es-419', 'es-CO', 'es-AR', 'es-CL', 'es-PE', 'es-VE', 'es-GT', 'es-EC', 'es-BO', 'es-CU', 'es-DO', 'es-HN', 'es-NI', 'es-PA', 'es-PR', 'es-PY', 'es-SV', 'es-UY'].some(lang => v.lang.startsWith(lang));
    const esProveedor = v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Apple');
    return latamLangs.some(l => v.lang.startsWith(l)) && (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Apple')) && (esVozFemenina(v.name) || (v.gender || '').toLowerCase() === 'female');
  });

  if (vocesFemeninasLatam.length > 0) {
    const orden = { 'Google': 3, 'Microsoft': 2, 'Apple': 1 };
    vocesFemeninasLatam.sort((a, b) => {
      const pa = Object.keys(orden).find(p => a.name.includes(p)) || '';
      const pb = Object.keys(orden).find(p => b.name.includes(p)) || '';
      return (orden[pb] || 0) - (orden[pa] || 0);
    });
    vozSeleccionada = vocesFemeninasLatam[0];
    console.log('Voz TTS:', vozSeleccionada.name, vozSeleccionada.lang);
    return;
  }

  // Fallback 1: Cualquier voz latina femenina
  const vocesFemLatam = vocesDisponibles.filter(v =>
    ['es-MX','es-419','es-CO','es-AR','es-CL','es-PE','es-VE','es-GT','es-EC','es-BO','es-CU','es-DO','es-HN','es-NI','es-PA','es-PR','es-PY','es-SV','es-UY'].some(l => v.lang.startsWith(l)) &&
    ((v.gender || '').toLowerCase() === 'female' || (() => { const n = v.name.toLowerCase(); return n.includes('female') || n.includes('mujer'); })())
  );
  if (vocesFemLatam.length > 0) {
    vozSeleccionada = vocesFemLatam[0];
    console.log('Voz TTS (fallback 1):', vozSeleccionada.name, vozSeleccionada.lang);
    return;
  }

  // Fallback 2: Cualquier voz latam no local
  let voz = vocesDisponibles.find(v =>
    ['es-MX','es-419','es-CO','es-AR','es-CL','es-PE','es-VE','es-GT','es-EC','es-BO','es-CU','es-DO','es-HN','es-NI','es-PA','es-PR','es-PY','es-SV','es-UY'].some(l => v.lang.startsWith(l)) &&
    !v.name.toLowerCase().includes('local')
  );

  // Fallback 3: voz español no local, no España, preferiblemente femenina
  if (!voz) {
    voz = vocesDisponibles.find(v =>
      v.lang.startsWith('es') &&
      !v.name.toLowerCase().includes('local') &&
      !v.lang.startsWith('es-ES') &&
      ((v.gender || '').toLowerCase() === 'female' || (() => { const n = v.name.toLowerCase(); return n.includes('female') || n.includes('mujer'); })())
    );
  }

  // Último fallback
  if (!voz) {
    voz = vocesDisponibles.find(v => v.lang.startsWith('es'));
  }

  vozSeleccionada = voz;
  console.log('Voz TTS:', vozSeleccionada?.name, vozSeleccionada?.lang, vozSeleccionada?.gender || '?');
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

function iniciar() {
  chat.replaceChildren();
  const bienvenida = el('div', 'msg bot');
  bienvenida.style.setProperty('--c', '#2f6f62');
  bienvenida.append(el('div', '', 'Hola. Soy Alma, tu acompañante. ¿Cómo te sientes hoy?'));
  chat.appendChild(bienvenida);
  scroll();
  input.focus();
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
      responder();
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
  mensajeUsuario(texto);
  input.value = '';
  responder();
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
    if (ultimo) hablar(ultimo);
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