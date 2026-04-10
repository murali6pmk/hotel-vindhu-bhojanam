import { getSupabase, seedDefaults } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const db = getSupabase();
    await seedDefaults();

    if (req.method === 'GET') {
      const { data } = await db.from('settings').select('*').limit(1);
      res.status(200).json(data?.[0] || { upi_id: '', upi_name: 'Hotel Vindhu Bhojanam', upi_note: 'Pay for your order' });
    } else if (req.method === 'PUT') {
      const { upi_id, upi_name, upi_note } = req.body;
      const { data: existing } = await db.from('settings').select('id').limit(1);
      if (existing && existing.length > 0) {
        await db.from('settings').update({ upi_id, upi_name, upi_note, updated_at: new Date().toISOString() }).eq('id', existing[0].id);
      } else {
        await db.from('settings').insert({ upi_id, upi_name, upi_note });
      }
      res.status(200).json({ ok: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
