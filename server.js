const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const ROOT = process.cwd();

const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || 'tu@correo.com').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
const DEMO_CODE = process.env.DEMO_CODE || '123456';
const MOCK_REPLY = process.env.MOCK_REPLY || 'Recibí tu mensaje. Aquí estoy escuchándote. ¿Qué tal va tu día?';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

const SYSTEM_PROMPT = require('./api/_prompt');

const otps = new Map();
const tokens = new Map();

function norm(e) { return String(e || '').trim().toLowerCase(); }

async function geminiReply(text) {
  if (!GEMINI_API_KEY) return null;
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text }] }],
          generationConfig: { maxOutputTokens: 400, temperature: 0.8 }
        })
      }
    );
    const d = await r.json();
    if (!r.ok) throw new Error(d.error?.message || 'Error de Gemini');
    return d.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
  } catch (e) {
    console.error('gemini error:', e.message);
    return null;
  }
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png' };
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('No encontrado'); return; }
    res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
    res.end(data);
  });
}

function json(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const p = url.pathname;

  if (p === '/api/login' && req.method === 'POST') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const email = norm(JSON.parse(body || '{}').email);
    if (!/^\S+@\S+\.\S+$/.test(email)) return json(res, 400, { error: 'Correo inválido' });
    if (!ALLOWED_EMAILS.includes(email)) return json(res, 400, { error: 'Correo no autorizado en esta prueba local' });
    otps.set(email, { code: DEMO_CODE, exp: Date.now() + 600000 });
    return json(res, 200, { ok: true });
  }

  if (p === '/api/verify' && req.method === 'POST') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const { email, code } = JSON.parse(body || '{}');
    const e = norm(email);
    const c = String(code || '').trim();
    const otp = otps.get(e);
    if (!otp || otp.code !== c || Date.now() > otp.exp) return json(res, 400, { error: 'Código inválido' });
    otps.delete(e);
    const token = crypto.randomBytes(16).toString('hex');
    tokens.set(token, e);
    return json(res, 200, { token });
  }

  if (p === '/api/chat' && req.method === 'POST') {
    const auth = req.headers.authorization || '';
    const token = auth.replace('Bearer ', '');
    if (!tokens.has(token)) return json(res, 401, { error: 'Acceso no válido' });
    let body = '';
    for await (const chunk of req) body += chunk;
    const { messages } = JSON.parse(body || '{}');
    const texto = messages && messages[messages.length - 1] ? messages[messages.length - 1].content : '';

    let reply = await geminiReply(texto);
    if (!reply) reply = MOCK_REPLY;

    return json(res, 200, { reply, crisis: false });
  }

  const filePath = path.join(ROOT, p === '/' ? 'index.html' : p.slice(1));
  sendFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Probador local en http://localhost:${PORT}`);
  console.log('Correos permitidos:', ALLOWED_EMAILS.join(', '));
  console.log('Código demo:', DEMO_CODE);
  console.log('IA real (Gemini):', GEMINI_API_KEY ? 'SÍ' : 'NO (respuestas simuladas)');
});
