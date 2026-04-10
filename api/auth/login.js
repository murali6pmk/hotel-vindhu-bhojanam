import { getSupabase, seedDefaults } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const db = getSupabase();
    await seedDefaults();
    const { username, password } = req.body;
    const { data, error } = await db
      .from('credentials')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .limit(1);
    if (error) throw new Error(error.message);
    if (data && data.length > 0) {
      res.status(200).json({ ok: true, owner: data[0].owner_name });
    } else {
      res.status(401).json({ ok: false, error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
