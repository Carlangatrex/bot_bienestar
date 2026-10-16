const crypto = require('crypto');
const { redis, norm, sign, isActive } = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const email = norm(req.body?.email);
  const code = String(req.body?.code || '').trim();
  const bad = () => res.status(400).json({ error: 'Ese código no es válido o ya venció. Pide uno nuevo.' });

  try {
    // Máximo 5 intentos por código
    const tries = await redis(['INCR', `otpTry:${email}`]);
    if (tries === 1) await redis(['EXPIRE', `otpTry:${email}`, '600']);
    if (tries > 5) {
      await redis(['DEL', `otp:${email}`]);
      return bad();
    }

    const saved = await redis(['GET', `otp:${email}`]);
    const a = Buffer.from(code);
    const b = Buffer.from(saved || '');
    if (!saved || a.length !== b.length || !crypto.timingSafeEqual(a, b) || !(await isActive(email))) return bad();

    await redis(['DEL', `otp:${email}`]); // el código sirve una sola vez
    res.status(200).json({ token: sign(email) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Algo falló. Inténtalo de nuevo.' });
  }
};
