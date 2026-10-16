// Utilidades compartidas. (El guion bajo evita que Vercel lo exponga como endpoint.)
const crypto = require('crypto');

const norm = (e) => String(e || '').trim().toLowerCase();

// Base de datos: Redis por REST (Upstash / Vercel KV). Usa el nombre de variables que te dé tu proveedor.
async function redis(cmd) {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || 'Error de Redis');
  return d.result;
}

// Token de sesión firmado: "payload.firma". Sin base de datos de sesiones.
const b64 = (s) => Buffer.from(s).toString('base64url');
const hmac = (p) => crypto.createHmac('sha256', process.env.SESSION_SECRET).update(p).digest('base64url');

function sign(email, days = 30) {
  const p = b64(JSON.stringify({ e: email, x: Date.now() + days * 864e5 }));
  return `${p}.${hmac(p)}`;
}

function verify(token) {
  try {
    const [p, s] = String(token || '').split('.');
    const a = Buffer.from(s || '');
    const b = Buffer.from(hmac(p));
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const { e, x } = JSON.parse(Buffer.from(p, 'base64url').toString());
    return x > Date.now() ? e : null;
  } catch {
    return null;
  }
}

// ¿Tiene suscripción activa? ALLOWED_EMAILS sirve para demos y pruebas del equipo.
async function isActive(email) {
  const allowed = (process.env.ALLOWED_EMAILS || '').split(',').map(norm).filter(Boolean);
  if (allowed.includes(email)) return true;
  return (await redis(['GET', `sub:${email}`])) === 'active';
}

module.exports = { redis, norm, sign, verify, isActive };
