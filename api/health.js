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

    // Check if credentials table exists
    const { data, error } = await db.from('credentials').select('id').limit(1);

    if (error) {
      if (error.code === 'PGRST205') {
        return res.status(200).json({
          ok: false,
          database: 'tables_missing',
          message: 'Tables not created yet. Run the SQL script in Supabase SQL Editor.'
        });
      }
      if (error.code === '42501') {
        return res.status(200).json({
          ok: false,
          database: 'rls_blocked',
          message: 'Row Level Security is blocking access. Run the SQL fix in Supabase.'
        });
      }
      return res.status(200).json({
        ok: false,
        database: 'error',
        message: error.message
      });
    }

    // Check if admin credentials exist
    const { data: creds } = await db.from('credentials').select('username').limit(1);
    if (!creds || creds.length === 0) {
      return res.status(200).json({
        ok: false,
        database: 'no_credentials',
        message: 'Tables exist but admin user not created. Run the SQL fix.'
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
