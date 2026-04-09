import { getSupabase } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const db = getSupabase();
    if (req.method === 'GET') {
      const { data } = await db.from('credentials').select('username,owner_name,email').limit(1);
      res.status(200).json(data?.[0] || { username:'admin', owner_name:'', email:'' });
    } else if (req.method === 'PUT') {
      const { username, password, owner_name, email } = req.body;
      if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
      const { count } = await db.from('credentials').select('*', { count:'exact', head:true });
      if (count === 0) {
        await db.from('credentials').insert({ username, password, owner_name:owner_name||'', email:email||'' });
      } else {
        await db.from('credentials').update({ username, password, owner_name:owner_name||'', email:email||'', updated_at: new Date().toISOString() }).gte('id', 0);
      }
      res.status(200).json({ ok: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
