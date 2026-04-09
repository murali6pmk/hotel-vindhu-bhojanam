import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return res.status(200).json({
      ok: false,
      database: 'not_configured',
      message: 'SUPABASE_URL or SUPABASE_ANON_KEY not set in Vercel environment variables'
    });
  }

  try {
    const db = createClient(url, key);
    // Try to query credentials table
    const { error } = await db.from('credentials').select('id').limit(1);
    if (error) {
      return res.status(200).json({
        ok: false,
        database: 'tables_missing',
        message: 'Connected to Supabase but tables not created yet. Run the SQL setup script.'
      });
    }
    return res.status(200).json({
      ok: true,
      database: 'connected',
      message: 'Supabase PostgreSQL connected and ready ✔'
    });
  } catch (err) {
    return res.status(200).json({
      ok: false,
      database: 'error',
      message: 'Connection error: ' + err.message
    });
  }
}
