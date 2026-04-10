import { getSupabase, seedDefaults, toOrder } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const db = getSupabase();
    await seedDefaults();
    if (req.method === 'GET') {
      const { data, error } = await db.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      res.status(200).json((data || []).map(toOrder));
    } else if (req.method === 'POST') {
      const { id, customerName, customerPhone, tableNo, items, total, status, paymentStatus, paymentMethod, notes } = req.body;
      const { error } = await db.from('orders').insert({
        id, customer_name: customerName, customer_phone: customerPhone || '',
        table_no: tableNo, items: items || [], total,
        status: status || 'pending', payment_status: paymentStatus || 'unpaid',
        payment_method: paymentMethod || '', notes: notes || ''
      });
      if (error) throw new Error(error.message);
      res.status(200).json({ ok: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Orders error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
