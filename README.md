# 🍛 Hotel Vindhu Bhojanam — Restaurant Website

A full-stack 3D restaurant website with admin portal for **Hotel Vindhu Bhojanam**, Ongole, Andhra Pradesh.

## ✨ Features

- Beautiful 3D village-themed restaurant website
- Telugu + English bilingual content
- Admin portal at `/admin`
- Menu management (add/edit/delete items & prices)
- Order & payment tracking
- Supabase PostgreSQL database backend

## 🚀 Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4
- **Backend:** Vercel Serverless Functions (Node.js)
- **Database:** Supabase (PostgreSQL) — free, India-friendly
- **Hosting:** Vercel

## 🛠️ Local Development

```bash
npm install
npm run dev
```

## 🌐 Deploy to Vercel

1. Push this repo to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add environment variables (see below)
4. Deploy!

## 🔑 Environment Variables

Add these in Vercel → Settings → Environment Variables:

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon/public key |

## 🗄️ Database Setup (Supabase — Free)

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project (region: Singapore)
3. Go to **SQL Editor** → run this:

```sql
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
);
```

4. Go to **Project Settings → API** → copy URL and anon key
5. Add them as Vercel environment variables

## 🔐 Admin Login

Default credentials:
- **Username:** `admin`
- **Password:** `vindhu@2025`

Change these in Admin Portal → Settings after first login.

## 📍 Restaurant Info

**Hotel Vindhu Bhojanam**  
Old bypass road, opposite to Padma Towers,  
beside Reliance Smart, Pandaripuram,  
Ongole, Andhra Pradesh 523002  
📞 081436 68888
