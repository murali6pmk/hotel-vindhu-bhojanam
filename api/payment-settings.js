import { getSupabase, seedDefaults } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await seedDefaults();
    const db = getSupabase();

    if (req.method === 'GET') {
      const { data, error } = await db.from('payment_settings').select('*').limit(1);
      if (error && error.code === 'PGRST205') {
        return res.status(200).json({ upi_id: '', merchant_name: 'Hotel Vindhu Bhojanam', tax_percent: 0, delivery_fee: 0 });
      }
      return res.status(200).json(data?.[0] || { upi_id: '', merchant_name: 'Hotel Vindhu Bhojanam', tax_percent: 0, delivery_fee: 0 });
    }

    if (req.method === 'POST') {
      const { upi_id, merchant_name, tax_percent, delivery_fee } = req.body;
      // Validate UPI ID format
      const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
      if (upi_id && !upiRegex.test(upi_id)) {
        return res.status(400).json({ error: 'Invalid UPI ID format. Use format: name@bank (e.g. vindhu@ybl)' });
      }
      const { count } = await db.from('payment_settings').select('*', { count: 'exact', head: true });
      if (count === 0) {
        await db.from('payment_settings').insert({ upi_id: upi_id || '', merchant_name: merchant_name || 'Hotel Vindhu Bhojanam', tax_percent: tax_percent || 0, delivery_fee: delivery_fee || 0 });
      } else {
        await db.from('payment_settings').update({ upi_id: upi_id || '', merchant_name: merchant_name || 'Hotel Vindhu Bhojanam', tax_percent: tax_percent || 0, delivery_fee: delivery_fee || 0, updated_at: new Date().toISOString() }).gte('id', 0);
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
