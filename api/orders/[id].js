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
      const b = req.body;
      const update = { updated_at: new Date().toISOString() };
      if (b.customerName !== undefined) update.customer_name = b.customerName;
      if (b.customerPhone !== undefined) update.customer_phone = b.customerPhone;
      if (b.tableNo !== undefined) update.table_no = b.tableNo;
      if (b.items !== undefined) update.items = b.items;
      if (b.total !== undefined) update.total = b.total;
      if (b.status !== undefined) update.status = b.status;
      if (b.paymentStatus !== undefined) update.payment_status = b.paymentStatus;
      if (b.paymentMethod !== undefined) update.payment_method = b.paymentMethod;
      if (b.notes !== undefined) update.notes = b.notes;
      await db.from('orders').update(update).eq('id', id);
      res.status(200).json({ ok: true });
    } else if (req.method === 'DELETE') {
      await db.from('orders').delete().eq('id', id);
      res.status(200).json({ ok: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
