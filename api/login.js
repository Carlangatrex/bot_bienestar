const crypto = require('crypto');
const { redis, norm, isActive } = require('./_lib');

async function sendMail(to, code) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM,
      to,
      subject: 'Tu código para entrar',
      html: `<p>Tu código es:</p><p style="font-size:28px;letter-spacing:4px"><b>${code}</b></p><p>Vence en 10 minutos. Si no lo pediste, ignora este correo.</p>`,
    }),
  });
  if (!r.ok) throw new Error('Resend ' + r.status);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const email = norm(req.body?.email);
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Escribe un correo válido.' });

  try {
    // Máximo 5 códigos por hora por correo
    const n = await redis(['INCR', `rl:${email}`]);
    if (n === 1) await redis(['EXPIRE', `rl:${email}`, '3600']);
    if (n > 5) return res.status(429).json({ error: 'Demasiados intentos. Prueba de nuevo en una hora.' });

    if (await isActive(email)) {
      // Demo: los correos de ALLOWED_EMAILS usan DEMO_CODE y no dependen de que llegue un correo
      const allowed = (process.env.ALLOWED_EMAILS || '').split(',').map(norm);
      const demo = process.env.DEMO_CODE && allowed.includes(email);
      const code = demo ? process.env.DEMO_CODE : String(crypto.randomInt(0, 1e6)).padStart(6, '0');
      await redis(['SET', `otp:${email}`, code, 'EX', '600']);
      await redis(['DEL', `otpTry:${email}`]);
      if (!demo) await sendMail(email, code);
    }
    // Misma respuesta exista o no la suscripción: no revela quién es cliente
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Algo falló. Inténtalo de nuevo.' });
  }
};
