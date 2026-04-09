import { getSupabase } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { id } = req.query;
  try {
    const db = getSupabase();
    if (req.method === 'PUT') {
      const { name, telugu, price, desc, img, popular, category, available } = req.body;
      await db.from('menu_items').update({
        name, telugu:telugu||'', price, description:desc||'',
        img:img||'/images/food1.jpg', popular:!!popular,
        category, available:available!==false, updated_at:new Date().toISOString()
      }).eq('id', id);
      res.status(200).json({ ok: true });
    } else if (req.method === 'DELETE') {
      await db.from('menu_items').delete().eq('id', id);
      res.status(200).json({ ok: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
