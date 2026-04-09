// API client — talks to Vercel serverless functions backed by PostgreSQL

export type MenuItem = {
  id: string;
  name: string;
  telugu: string;
  price: number;
  desc: string;
  img: string;
  popular: boolean;
  category: string;
  available: boolean;
};

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  tableNo: string;
  items: { itemId: string; itemName: string; qty: number; price: number }[];
  total: number;
  status: 'pending' | 'preparing' | 'served' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'partial';
  paymentMethod: 'cash' | 'upi' | 'card' | '';
  createdAt: string;
  updatedAt: string;
  notes: string;
};

export type AdminCredentials = {
  username: string;
  password: string;
  owner_name: string;
  email: string;
};

const BASE = '/api';

async function http<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ---- Auth ----
export async function login(username: string, password: string) {
  return http<{ ok: boolean; owner?: string; error?: string }>(
    `${BASE}/auth/login`,
    { method: 'POST', body: JSON.stringify({ username, password }) }
  );
}

export async function getCredentials() {
  return http<{ username: string; owner_name: string; email: string }>(
    `${BASE}/auth/credentials`
  );
}

export async function saveCredentials(creds: AdminCredentials) {
  return http<{ ok: boolean }>(
    `${BASE}/auth/credentials`,
    { method: 'PUT', body: JSON.stringify(creds) }
  );
}

// ---- Menu ----
export async function getMenuItems(): Promise<MenuItem[]> {
  return http<MenuItem[]>(`${BASE}/menu`);
}

export async function saveMenuItem(item: MenuItem) {
  return http<{ ok: boolean }>(
    `${BASE}/menu`,
    { method: 'POST', body: JSON.stringify(item) }
  );
}

export async function updateMenuItem(id: string, item: Partial<MenuItem>) {
  return http<{ ok: boolean }>(
    `${BASE}/menu/${id}`,
    { method: 'PUT', body: JSON.stringify(item) }
  );
}

export async function deleteMenuItem(id: string) {
  return http<{ ok: boolean }>(`${BASE}/menu/${id}`, { method: 'DELETE' });
}

// ---- Orders ----
export async function getOrders(): Promise<Order[]> {
  return http<Order[]>(`${BASE}/orders`);
}

export async function createOrder(order: Order) {
  return http<{ ok: boolean }>(
    `${BASE}/orders`,
    { method: 'POST', body: JSON.stringify(order) }
  );
}

export async function updateOrder(id: string, data: Partial<Order>) {
  return http<{ ok: boolean }>(
    `${BASE}/orders/${id}`,
    { method: 'PUT', body: JSON.stringify(data) }
  );
}

export async function deleteOrder(id: string) {
  return http<{ ok: boolean }>(`${BASE}/orders/${id}`, { method: 'DELETE' });
}

// ---- Helpers ----
export function generateId(prefix: string): string {
  return `${prefix}${Date.now().toString(36).toUpperCase()}`;
}
