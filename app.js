const chat = document.getElementById('chat');
const input = document.getElementById('input');
const enviar = document.getElementById('enviar');
const dlg = document.getElementById('ayuda');
const colas = {};
const MAX_TURNOS = 5;
let turnos = 0;

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

function scroll() { chat.scrollTop = chat.scrollHeight; }

function siguiente(est) {
  if (!colas[est.id] || !colas[est.id].length) {
    colas[est.id] = [...est.mensajes].sort(() => Math.random() - 0.5);
  }
  return colas[est.id].pop();
}

function mensajeBot(texto, est) {
  const b = el('div', 'msg bot');
  if (est) b.style.setProperty('--c', est.color);
  b.append(el('div', '', texto));
  chat.appendChild(b);
  scroll();
}

function mensajeUsuario(texto) {
  chat.appendChild(el('div', 'msg usuario', texto));
  scroll();
}

function respuestaHumana(est) {
  const base = siguiente(est);
  const abre = EMPATIA[est.id] || ['Te entiendo.'];
  const opener = abre[Math.floor(Math.random() * abre.length)];
  if (opener.endsWith('que ')) {
    const propios = ['Dios', 'Jesús', 'Señor'];
    const palabra = base.split(' ')[0];
    const ajuste = propios.includes(palabra) ? base : base.charAt(0).toLowerCase() + base.slice(1);
    return opener + ajuste;
  }
  return opener + base;
}

function responder(est) {
  mensajeBot(respuestaHumana(est), est);

  if (est.ayuda) {
    const acciones = el('div', 'acciones');
    const a = el('button', 'link', '¿Necesitas hablar con alguien? Ver líneas de ayuda');
    a.type = 'button';
    a.addEventListener('click', () => dlg.showModal());
    acciones.appendChild(a);
    chat.appendChild(acciones);
    scroll();
  }
}

function coincideExacto(texto, palabra) {
  const p = palabra.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![\\p{L}\\p{N}])${p}(?![\\p{L}\\p{N}])`, 'iu').test(texto);
}

function normalizar(texto) {
  return texto.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function distancia(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + costo);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }
  return dp[m][n];
}

function coincideFlexible(texto, palabra) {
  const pal = normalizar(palabra).replace(/\s/g, '');
  if (pal.length < 5) return false;
  const norm = normalizar(texto);
  if (norm.replace(/\s/g, '').includes(pal)) return true;
  const umbral = pal.length >= 8 ? 2 : 1;
  return norm.split(' ').some(tok => tok.length > 0 && Math.abs(tok.length - pal.length) <= 1 && distancia(tok, pal) <= umbral);
}

function coincide(texto, palabra) {
  return coincideExacto(texto, palabra) || coincideFlexible(texto, palabra);
}

const PATRONES = [
  ['mal', ['mal', 'me siento mal', 'estoy mal', 'muy mal', 'malísimo', 'malisimo', 'horrible', 'terrible', 'pésimo', 'pesimo', 'desesperado', 'desesperada', 'peor', 'fatal', 'no me siento bien']],
  ['bien', ['bien', 'me siento bien', 'estoy bien', 'muy bien', 'tranquilo', 'tranquila', 'normal', 'genial', 'excelente', 'maravilloso', 'maravillosa', 'fantástico', 'fantastico', 'fantástica', 'fantastica', 'despreocupado', 'despreocupada', 'satisfecho', 'satisfecha']],
  ['alegre', ['alegre', 'alegría', 'alegria', 'feliz', 'contento', 'contenta', 'radiante']],
  ['cansancio', ['cansado', 'cansada', 'sueño', 'soñoliento', 'soñolienta', 'agotado', 'agotada', 'fatiga', 'dormido', 'dormida', 'exhausto', 'exhausta']],
  ['estres', ['estrés', 'estres', 'ansiedad', 'presión', 'presion', 'urgente', 'agobiado', 'agobiada', 'agobio', 'estresado', 'estresada', 'tenso', 'tensa', 'nervioso', 'nerviosa', 'intranquilo', 'intranquila']],
  ['triste', ['triste', 'tristeza', 'deprimido', 'deprimida', 'llorar', 'vacío', 'vacio', 'vacía', 'vacia', 'melancólico', 'melancolico', 'melancólica', 'melancolica', 'decaído', 'decaido', 'decaída', 'decaida', 'infeliz', 'desanimado', 'desanimada', 'desanimo', 'desánimo', 'apenado', 'apenada', 'descontento', 'descontenta', 'desdichado', 'desdichada']],
  ['agradecimiento', ['gracias', 'agradecido', 'agradecida', 'agradecimiento']],
  ['motivacion', ['motivación', 'motivacion', 'motivado', 'motivada', 'ánimo', 'animo', 'ánimos', 'animos', 'fuerza', 'adelante', 'empezar']],
  ['enojo', ['enojo', 'enojado', 'enojada', 'ira', 'rabioso', 'rabiosa', 'enojarse', 'enfadado', 'enfadada', 'furioso', 'furiosa', 'molesto', 'molesta', 'harto', 'harta', 'irritado', 'irritada']],
  ['preocupacion', ['preocupación', 'preocupacion', 'preocupado', 'preocupada', 'miedo', 'inquieto', 'inquieta', 'inquietud', 'ansioso', 'ansiosa', 'temor', 'temo', 'temer']],
  ['soledad', ['soledad', 'solo', 'sola', 'solitario', 'solitaria', 'aislado', 'aislada', 'abandonado', 'abandonada']],
  ['confusion', ['confusión', 'confusion', 'confundido', 'confundida', 'no sé', 'no se', 'duda', 'dudas', 'dudo', 'dudar', 'perdido', 'perdida', 'no entiendo']],
  ['esperanza', ['esperanza', 'futuro', 'mañana', 'mejorará', 'mejorara', 'superar', 'renacer', 'nuevo comienzo']],
];

function detectarEstado(texto) {
  for (const [id, palabras] of PATRONES) {
    if (palabras.some(p => coincideExacto(texto, p))) {
      return ESTADOS.find(e => e.id === id);
    }
  }
  for (const [id, palabras] of PATRONES) {
    if (palabras.some(p => coincideFlexible(texto, p))) {
      return ESTADOS.find(e => e.id === id);
    }
  }
  return null;
}

function detectarConversacion(texto) {
  for (const c of CONVERSACION) {
    if (c.patrones.some(p => coincide(texto, p))) {
      return c.respuestas[Math.floor(Math.random() * c.respuestas.length)];
    }
  }
  return null;
}

function iniciar() {
  turnos = 0;
  input.disabled = false;
  enviar.disabled = false;
  chat.replaceChildren();
  mensajeBot('Hola, ¿cómo te sientes hoy?');
}

function indicador() {
  const b = el('div', 'msg bot escribiendo');
  for (let i = 0; i < 3; i++) b.appendChild(el('span', 'punto'));
  chat.appendChild(b);
  scroll();
  return b;
}

function enviarMensaje() {
  const texto = input.value.trim();
  if (!texto) return;
  turnos++;
  mensajeUsuario(texto);
  input.value = '';
  const est = detectarEstado(texto);
  const conv = est ? null : detectarConversacion(texto);
  const noEntiendo = NO_ENTIENDO[Math.floor(Math.random() * NO_ENTIENDO.length)];
  input.disabled = true;
  const ind = indicador();
  setTimeout(() => {
    ind.remove();
    if (est) {
      responder(est);
    } else if (conv) {
      mensajeBot(conv);
    } else {
      mensajeBot(noEntiendo);
    }
    if (turnos >= MAX_TURNOS) {
      finalizar();
    } else {
      input.disabled = false;
      input.focus();
    }
  }, 900 + Math.random() * 700);
}

function finalizar() {
  chat.querySelectorAll('.acciones').forEach(n => n.remove());
  mensajeBot(MENSAJE_FINAL);

  const acciones = el('div', 'acciones');
  const reiniciar = el('button', 'btn primario', 'Volver a empezar');
  reiniciar.type = 'button';
  reiniciar.addEventListener('click', () => { chat.replaceChildren(); iniciar(); });
  acciones.appendChild(reiniciar);

  const a = el('button', 'link', '¿Necesitas hablar con alguien? Ver líneas de ayuda');
  a.type = 'button';
  a.addEventListener('click', () => dlg.showModal());
  acciones.appendChild(a);
  chat.appendChild(acciones);
  scroll();

  input.disabled = true;
  enviar.disabled = true;
}

enviar.addEventListener('click', enviarMensaje);
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') enviarMensaje(); });

function ayudaNode() {
  const box = document.createElement('div');
  AYUDA.forEach((c) => {
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
