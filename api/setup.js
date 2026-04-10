// This endpoint creates all tables in Supabase automatically
// Visit /api/setup once after deploying to initialize the database
import { createClient } from '@supabase/supabase-js';\n
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'Supabase env vars not set' });
  }

  const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const results = [];

  try {
    // Check if credentials table exists by trying to select
    const { error: credErr } = await db.from('credentials').select('id').limit(1);

    if (credErr && credErr.code === 'PGRST205') {
      results.push({ table: 'credentials', status: 'NEEDS_CREATION' });
    } else {
      results.push({ table: 'credentials', status: 'EXISTS' });
    }

    const { error: menuErr } = await db.from('menu_items').select('id').limit(1);
    if (menuErr && menuErr.code === 'PGRST205') {
      results.push({ table: 'menu_items', status: 'NEEDS_CREATION' });
    } else {
      results.push({ table: 'menu_items', status: 'EXISTS' });
    }

    const { error: ordErr } = await db.from('orders').select('id').limit(1);
    if (ordErr && ordErr.code === 'PGRST205') {
      results.push({ table: 'orders', status: 'NEEDS_CREATION' });
    } else {
      results.push({ table: 'orders', status: 'EXISTS' });
    }

    const needsSetup = results.some(r => r.status === 'NEEDS_CREATION');

    return res.status(200).json({
      ok: true,
      needsSetup,
      tables: results,
      supabaseUrl: SUPABASE_URL,
      sql: needsSetup ? `-- Run this in Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS credentials (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL DEFAULT 'admin',
  password TEXT NOT NULL DEFAULT 'vindhu@2025',
  owner_name TEXT DEFAULT 'Hotel Vindhu Bhojanam',
  email TEXT DEFAULT 'vindhu@gmail.com',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  telugu TEXT DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  description TEXT DEFAULT '',
  img TEXT DEFAULT '/images/food1.jpg',
  popular BOOLEAN DEFAULT false,
  category TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT DEFAULT '',
  table_no TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  payment_method TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);` : null,
      message: needsSetup
        ? 'Tables need to be created. Copy the SQL above and run it in Supabase SQL Editor.'
        : 'All tables exist! Database is ready.'
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
