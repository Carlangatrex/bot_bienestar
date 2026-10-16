// Función serverless (Vercel). Las claves viven SOLO aquí, como variables de entorno.
// PROVIDER = gemini | claude | openai   (cambia de proveedor sin tocar el frontend)
// MODEL    = opcional, para sobrescribir el modelo por defecto

const SYSTEM_PROMPT = require('./_prompt');

const DEFAULTS = {
  gemini: 'gemini-2.5-flash',
  claude: 'claude-haiku-5-5',
  openai: 'gpt-4o-mini',
};

// messages: [{ role: 'user' | 'assistant', content: '...' }]
const adapters = {
  async gemini(messages, model) {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: messages.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
          generationConfig: { maxOutputTokens: 400, temperature: 0.8 },
        }),
      }
    );
    const d = await r.json();
    if (!r.ok) throw new Error(d.error?.message || 'Error de Gemini');
    return d.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
  },

  async claude(messages, model) {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error?.message || 'Error de Claude');
    return d.content?.map((b) => b.text || '').join('') || '';
  },

  async openai(messages, model) {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 400,
        temperature: 0.8,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error?.message || 'Error de OpenAI');
    return d.choices?.[0]?.message?.content || '';
  },
};

// Detección simple de señales de crisis: la app muestra los números de ayuda aunque el modelo falle
const CRISIS = /suicid|quitarme la vida|matarme|no quiero (seguir|vivir)|desaparecer|hacerme dano|acabar con todo|no vale la pena (vivir|seguir)|cortarme las venas/;
const esCrisis = (t) => CRISIS.test(String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));

const { verify, isActive } = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  // Solo suscriptores activos (se revalida en cada mensaje: si cancelan, se corta el acceso)
  const email = verify((req.headers.authorization || '').replace('Bearer ', ''));
  try {
    if (!email || !(await isActive(email))) return res.status(401).json({ error: 'Acceso no válido' });
  } catch (e) {
    return res.status(500).json({ error: 'Error al verificar acceso' });
  }

  const provider = (process.env.PROVIDER || 'gemini').toLowerCase();
  const adapter = adapters[provider];
  if (!adapter) return res.status(500).json({ error: `Proveedor desconocido: ${provider}` });

  // Validar y recortar historial (últimos 20 mensajes)
  const raw = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const messages = raw
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  // Debe empezar con un mensaje del usuario
  while (messages.length && messages[0].role !== 'user') messages.shift();
  if (!messages.length) return res.status(400).json({ error: 'Sin mensajes' });

  try {
    const reply = await adapter(messages, process.env.MODEL || DEFAULTS[provider]);
    res.status(200).json({ reply: reply.trim(), crisis: esCrisis(messages[messages.length - 1].content) });
  } catch (e) {
    console.error(e);
    if (/quota|rate limit|exhausted|too many|429/i.test(e.message)) {
      return res.status(429).json({ error: 'Hay muchas conversaciones en este momento. Espera un minuto e inténtalo de nuevo.' });
    }
    res.status(502).json({ error: 'No pude responder ahora. Inténtalo de nuevo.' });
  }
};

module.exports.adapters = adapters;
module.exports.DEFAULTS = DEFAULTS;
