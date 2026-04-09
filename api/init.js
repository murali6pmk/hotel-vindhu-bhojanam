import { initDB } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    await initDB();
    res.status(200).json({ ok: true, message: 'Database initialized' });
  } catch (err) {
    console.error('Init error:', err);
    res.status(500).json({ error: err.message });
  }
}
