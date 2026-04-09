// Re-export from api.ts for backward compat — all data now goes to PostgreSQL via API
export type { MenuItem, Order, AdminCredentials } from './api';
export { generateId } from './api';

// Legacy localStorage stubs — no longer used but kept to avoid import errors
export function getMenuItems() { return [] as any[]; }
export function saveMenuItems(_: any) {}
export function getOrders() { return [] as any[]; }
export function saveOrders(_: any) {}
export function getCredentials() { return { username: '', password: '', owner_name: '', email: '' }; }
export function saveCredentials(_: any) {}
