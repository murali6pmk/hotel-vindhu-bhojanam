import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return res.status(500).json({ error: 'Supabase env vars not set' });

  try {
    const db = createClient(url, key);
    const { error } = await db.from('credentials').select('id').limit(1);
    if (error) {
      return res.status(200).json({ ok: false, needsSetup: true, message: error.message });
    }
    return res.status(200).json({ ok: true, needsSetup: false, message: 'Database ready' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
