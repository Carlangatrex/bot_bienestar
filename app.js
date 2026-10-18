const chat = document.getElementById('chat');
const input = document.getElementById('input');
const enviar = document.getElementById('enviar');
const mic = document.getElementById('mic');
const repeatBtn = document.getElementById('repeat');
const dlg = document.getElementById('ayuda');
const colas = {};

let arquetipoActual = 'calido'; // Arquetipo por defecto
let síntesis = window.speechSynthesis;
let reconocimiento = null;
let escuchando = false;

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

let hablando = false;
function hablar(texto, arquetipo) {
  if (!síntesis) return;
  if (hablando) síntesis.cancel();
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'es-ES';
  utterance.rate = arquetipo === 'sensible' ? 0.85 : arquetipo === 'directivo' ? 1.1 : 1.0;
  utterance.pitch = arquetipo === 'sensible' ? 1.1 : arquetipo === 'directivo' ? 0.95 : 1.0;
  const voces = síntesis.getVoices();
  const voz = voces.find(v => v.lang.startsWith('es') && (arquetipo === 'sensible' ? v.name.includes('Female') || v.name.includes('Mujer') : v.name.includes('Male') || v.name.includes('Hombre'))) || voces.find(v => v.lang.startsWith('es'));
  if (voz) utterance.voice = voz;
  utterance.onstart = () => { hablando = true; };
  utterance.onend = () => { hablando = false; };
  síntesis.speak(utterance);
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
    mic.textContent = 'Hablando...';
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
    mic.textContent = 'Hablar';
  };

  reconocimiento.start();
}

function repetirUltimo() {
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

function repetirUltimo() {
  const ultimos = chat.querySelectorAll('.msg.bot');
  if (ultimos.length > 0) {
    const ultimo = ultimos[ultimos.length - 1].textContent.trim();
    if (ultimo) hablar(ultimo, arquetipoActual);
  }
}

function toggleAyuda() { dlg.showModal(); }
function cerrarAyuda() { dlg.close(); }

// Inicialización
if ('speechSynthesis' in window) {
  síntesis = window.speechSynthesis;
  síntesis.getVoices();
  if (síntesis.onvoiceschanged !== undefined) síntesis.onvoiceschanged = () => síntesis.getVoices();
}

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  mic.style.display = 'flex';
  repeatBtn.style.display = 'flex';
}

enviar.addEventListener('click', enviarMensaje);
input.addEventListener('keydown', e => { if (e.key === 'Enter') enviarMensaje(); });
mic.addEventListener('click', enviarMensajeVoz);
repeatBtn.addEventListener('click', repetirUltimo);

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