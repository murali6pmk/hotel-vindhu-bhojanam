-- Run this in Supabase SQL Editor to fix the admin portal
-- Go to: supabase.com → your project → SQL Editor → New Query → paste this → Run

-- Step 1: Disable Row Level Security on all tables
ALTER TABLE credentials DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Step 2: Insert default admin login
INSERT INTO credentials (username, password, owner_name, email)
VALUES ('admin', 'vindhu@2025', 'Hotel Vindhu Bhojanam', 'vindhu@gmail.com')
ON CONFLICT DO NOTHING;
