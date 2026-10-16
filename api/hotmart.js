// Recibe las notificaciones (webhook) de Hotmart y administra el acceso de cada suscriptor.
//
// Reglas de acceso (la clave sub:<correo> en Redis es el acceso; su caducidad es el fin del acceso):
//  - Compra/cobro aprobado ......... activo, sin caducidad
//  - Cancelación de suscripción .... activo hasta la fecha del próximo cobro (fin del periodo ya pagado)
//  - Pago atrasado ................. 3 días de gracia; si el pago entra, se reactiva con un "aprobado"
//  - Reembolso / contracargo ....... corte inmediato
const crypto = require('crypto');
const { redis, norm } = require('./_lib');

const ACTIVATE = ['PURCHASE_APPROVED', 'PURCHASE_COMPLETE'];
const CUT_NOW = ['PURCHASE_REFUNDED', 'PURCHASE_CHARGEBACK', 'PURCHASE_CANCELED'];
const GRACE_SECONDS = 3 * 24 * 3600;

function tokenOk(received) {
  const a = Buffer.from(String(received || ''));
  const b = Buffer.from(String(process.env.HOTMART_HOTTOK || ''));
  return a.length > 0 && a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Acepta milisegundos, segundos o texto ("2026-11-24 12:00:00")
function toMs(v) {
  if (v == null || v === '') return null;
  const n = Number(v);
  if (Number.isFinite(n)) return n < 1e12 ? n * 1000 : n;
  const s = String(v).replace(' ', 'T');
  const t = Date.parse(/[zZ]|[+-]\d\d:?\d\d$/.test(s) ? s : s + 'Z');
  return Number.isNaN(t) ? null : t;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  // 1) Validar el hottok (Hotmart lo envía en el header X-HOTMART-HOTTOK)
  const received = req.headers['x-hotmart-hottok'] || req.body?.hottok;
  if (!tokenOk(received)) return res.status(401).json({ error: 'hottok inválido' });

  const { id, event, data } = req.body || {};
  // En compras el correo viene en buyer; en cancelaciones, en subscriber
  const email = norm(data?.buyer?.email || data?.subscriber?.email || data?.user?.email);
  const key = `sub:${email}`;

  try {
    // 2) Evitar procesar dos veces el mismo evento (Hotmart puede reintentar)
    if (id) {
      const fresh = await redis(['SET', `hm:evt:${id}`, '1', 'NX', 'EX', '604800']);
      if (!fresh) return res.status(200).json({ ok: true, duplicado: true });
    }

    if (!email) {
      // Sin correo no hay nada que hacer; se registra la forma del evento (sin datos personales) para depurar
      console.log('hotmart sin correo', event, Object.keys(data || {}).join(','));
    } else if (ACTIVATE.includes(event)) {
      await redis(['SET', key, 'active']); // sin caducidad (y borra cualquier caducidad previa)
    } else if (CUT_NOW.includes(event)) {
      await redis(['DEL', key]);
    } else if (event === 'PURCHASE_DELAYED') {
      // Gracia de 3 días, solo si hoy no tiene caducidad (NX): no alarga una cancelación ya programada
      await redis(['EXPIRE', key, String(GRACE_SECONDS), 'NX']);
    } else if (event === 'SUBSCRIPTION_CANCELLATION') {
      const ms = toMs(data?.date_next_charge ?? data?.subscription?.date_next_charge ?? data?.purchase?.date_next_charge);
      if (ms && ms > Date.now()) await redis(['PEXPIREAT', key, String(Math.round(ms))]); // hasta el fin del periodo pagado
      else if (ms) await redis(['DEL', key]); // el periodo ya terminó
      else await redis(['EXPIRE', key, String(GRACE_SECONDS)]); // sin fecha en el evento: 3 días
      console.log('hotmart cancelación', ms ? 'con fecha' : 'SIN fecha de próximo cobro');
    }
    console.log('hotmart', event);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'fallo interno' }); // Hotmart reintentará
  }

  res.status(200).json({ ok: true });
};
