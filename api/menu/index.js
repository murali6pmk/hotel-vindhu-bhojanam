import { getSupabase, seedDefaults, toMenuItem } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const db = getSupabase();
    await seedDefaults();
    if (req.method === 'GET') {
      const { data, error } = await db.from('menu_items').select('*').order('category').order('created_at');
      if (error) throw new Error(error.message);
      res.status(200).json((data || []).map(toMenuItem));
    } else if (req.method === 'POST') {
      const { id, name, telugu, price, desc, img, popular, category, available } = req.body;
      const { error } = await db.from('menu_items').upsert({
        id, name, telugu: telugu || '', price,
        description: desc || '', img: img || '/images/food1.jpg',
        popular: !!popular, category, available: available !== false
      });
      if (error) throw new Error(error.message);
      res.status(200).json({ ok: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Menu error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
