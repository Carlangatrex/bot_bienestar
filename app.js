// El frontend NO sabe qué proveedor de IA se usa: solo habla con /api/chat.
const API_URL = '/api/chat';
const STORAGE_KEY = 'acompanante_historial';
const GREETING = 'Hola 🙂 Soy tu acompañante digital (una IA, no una persona ni un profesional de salud). ¿Cómo va tu día? Cuéntame lo que quieras, aquí te escucho.';

const chat = document.getElementById('chat');
const form = document.getElementById('form');
const input = document.getElementById('input');
const sendBtn = document.getElementById('send');

// Líneas de ayuda verificadas. Para agregar un país, copia un bloque y revisa el número en la fuente oficial.
const AYUDA = [
  { pais: 'México', lineas: [['Línea de la Vida (24 h, gratuita)', '800 911 2000'], ['Emergencias', '911']] },
  { pais: 'España', lineas: [['Línea 024, conducta suicida (24 h, gratuita)', '024'], ['Emergencias', '112']] },
  { pais: 'Colombia', lineas: [['Línea 106, salud mental (24 h, gratuita)', '106'], ['Emergencias', '123']] },
];
const AYUDA_MAS = 'https://findahelpline.com/es-419';

function ayudaNode() {
  const box = document.createElement('div');
  AYUDA.forEach((c) => {
    const t = document.createElement('div');
    t.className = 'pais';
    t.textContent = c.pais;
    box.appendChild(t);
    c.lineas.forEach(([nombre, num]) => {
      const a = document.createElement('a');
      a.className = 'tel';
      a.href = 'tel:' + num.replace(/\s/g, '');
      a.textContent = `${nombre}: ${num}`;
      box.appendChild(a);
    });
  });
  const mas = document.createElement('a');
  mas.className = 'tel';
  mas.href = AYUDA_MAS;
  mas.target = '_blank';
  mas.rel = 'noopener';
  mas.textContent = '¿Otro país? Busca tu línea aquí';
  box.appendChild(mas);
  return box;
}

function helpBubble() {
  const el = document.createElement('div');
  el.className = 'msg bot';
  const t = document.createElement('div');
  t.textContent = 'Si quieres hablar con alguien ahora mismo, estas líneas son gratuitas:';
  el.append(t, ayudaNode());
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
}

const TOKEN_KEY = 'acompanante_token';
const loginEl = document.getElementById('login');
const loginForm = document.getElementById('loginForm');
const loginMsg = document.getElementById('loginMsg');
const loginBtn = document.getElementById('loginBtn');

let history = load();
let token = null;
try { token = localStorage.getItem(TOKEN_KEY); } catch {}

function showLogin(msg = '') {
  loginEl.hidden = false;
  chat.hidden = true;
  form.hidden = true;
  loginMsg.textContent = msg;
  loginForm.hidden = false;
  document.getElementById('codeForm').hidden = true;
}
function showChat() {
  loginEl.hidden = true;
  chat.hidden = false;
  form.hidden = false;
  render();
}

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-40))); } catch {}
}

function bubble(role, text) {
  const el = document.createElement('div');
  el.className = 'msg ' + (role === 'user' ? 'me' : 'bot');
  el.textContent = text;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
  return el;
}

function render() {
  chat.innerHTML = '';
  bubble('assistant', GREETING);
  history.forEach((m) => bubble(m.role, m.content));
}

async function send(text) {
  history.push({ role: 'user', content: text });
  bubble('user', text);
  save();

  sendBtn.disabled = true;
  const typing = bubble('assistant', 'Escribiendo…');
  typing.classList.add('typing');

  try {
    const r = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ messages: history.slice(-20) }),
    });
    const d = await r.json();
    if (r.status === 401) {
      try { localStorage.removeItem(TOKEN_KEY); } catch {}
      token = null;
      history.pop();
      save();
      showLogin('Tu acceso ya no está activo. Entra de nuevo con tu correo de suscripción.');
      return;
    }
    if (r.status === 429) { const lim = new Error(d.error); lim.friendly = true; throw lim; }
    if (!r.ok || !d.reply) throw new Error(d.error || 'Error');
    typing.remove();
    history.push({ role: 'assistant', content: d.reply });
    bubble('assistant', d.reply);
    if (d.crisis) helpBubble();
    save();
  } catch (e) {
    typing.classList.remove('typing');
    typing.textContent = e.friendly ? e.message : 'No pude responder ahora. Inténtalo de nuevo en un momento.';
    history.pop(); // permite reintentar sin romper la alternancia de roles
    save();
  } finally {
    sendBtn.disabled = false;
    input.focus();
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text || sendBtn.disabled) return;
  input.value = '';
  input.style.height = 'auto';
  send(text);
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
});
input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 120) + 'px';
});

const codeForm = document.getElementById('codeForm');
const codeBtn = document.getElementById('codeBtn');
let pendingEmail = '';

async function post(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Algo falló. Inténtalo de nuevo.');
  return d;
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginBtn.disabled = true;
  loginMsg.textContent = 'Enviando código…';
  try {
    pendingEmail = document.getElementById('email').value.trim();
    await post('/api/login', { email: pendingEmail });
    loginForm.hidden = true;
    codeForm.hidden = false;
    loginMsg.textContent = 'Si ese correo tiene una suscripción activa, te enviamos un código de 6 dígitos. Revisa también el spam.';
    document.getElementById('code').focus();
  } catch (err) {
    loginMsg.textContent = err.message;
  } finally {
    loginBtn.disabled = false;
  }
});

codeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  codeBtn.disabled = true;
  try {
    const d = await post('/api/verify', { email: pendingEmail, code: document.getElementById('code').value });
    token = d.token;
    try { localStorage.setItem(TOKEN_KEY, token); } catch {}
    showChat();
  } catch (err) {
    loginMsg.textContent = err.message;
  } finally {
    codeBtn.disabled = false;
  }
});

const ayudaDlg = document.getElementById('ayuda');
document.getElementById('ayudaLista').appendChild(ayudaNode());
document.getElementById('ayudaBtn').addEventListener('click', () => ayudaDlg.showModal());
document.getElementById('cerrar').addEventListener('click', () => ayudaDlg.close());
document.getElementById('borrar').addEventListener('click', () => {
  history = [];
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
  ayudaDlg.close();
  if (token) render();
});
document.getElementById('salir').addEventListener('click', () => {
  history = [];
  token = null;
  try { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(TOKEN_KEY); } catch {}
  ayudaDlg.close();
  showLogin();
});

token ? showChat() : showLogin();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
