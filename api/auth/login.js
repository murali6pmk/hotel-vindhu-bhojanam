import { getSupabase, seedDefaults } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { username, password } = req.body;

    // Try Supabase first
    try {
      const db = getSupabase();
      await seedDefaults();
      const { data } = await db
        .from('credentials')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .limit(1);

      if (data && data.length > 0) {
        return res.status(200).json({ ok: true, owner: data[0].owner_name });
      } else {
        return res.status(401).json({ ok: false, error: 'Invalid credentials' });
      }
    } catch (dbErr) {
      // If DB fails, fallback to default credentials
      console.error('DB error, using fallback:', dbErr.message);
      if (username === 'admin' && password === 'vindhu@2025') {
        return res.status(200).json({ ok: true, owner: 'Hotel Vindhu Bhojanam' });
      }
      return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    // Last resort fallback
    const { username, password } = req.body || {};
    if (username === 'admin' && password === 'vindhu@2025') {
      return res.status(200).json({ ok: true, owner: 'Hotel Vindhu Bhojanam' });
    }
    res.status(500).json({ error: err.message });
  }
}
