// lib/store.js
// MVP data layer — uses localStorage for persistence

const OWNERS_KEY  = 'qrcar_owners';
const SESSION_KEY = 'qrcar_session';
const PINGS_KEY   = 'qrcar_pings';

/* ─── Helpers ─── */
const isBrowser = () => typeof window !== 'undefined';

function read(key) {
  if (!isBrowser()) return null;
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function write(key, data) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(data));
}

/* ─── Owners ─── */
export function getOwners() {
  return read(OWNERS_KEY) || {};
}

export function getOwnerById(id) {
  const owners = getOwners();
  return owners[id] || null;
}

export function saveOwner(owner) {
  const owners = getOwners();
  owners[owner.id] = owner;
  write(OWNERS_KEY, owners);
  return owner;
}

export function updateOwner(id, updates) {
  const owners = getOwners();
  if (!owners[id]) return null;
  owners[id] = { ...owners[id], ...updates };
  write(OWNERS_KEY, owners);
  return owners[id];
}

export function seedDemoOwner() {
  const demoId = 'demo-owner-001';
  const existing = getOwnerById(demoId);
  if (existing) return existing;

  const demo = {
    id:        demoId,
    name:      'Ahmed Al-Rashid',
    plate:     'ABC 1234',
    car:       'Toyota Camry 2022 — Silver',
    phone:     '+20 100 000 0000',
    email:     'ahmed@qrcar.app',
    whatsapp:  '+20 100 000 0000',
    avatar:    'https://api.dicebear.com/8.x/notionists/svg?seed=Ahmed&backgroundColor=0D1117',
    bio:       'Please ping me if my car is blocking you — I\'ll move it ASAP!',
    createdAt: Date.now(),
  };
  saveOwner(demo);
  return demo;
}

/* ─── Session (logged-in owner) ─── */
export function getSession() {
  return read(SESSION_KEY);
}
export function setSession(owner) {
  write(SESSION_KEY, owner);
}
export function clearSession() {
  if (isBrowser()) localStorage.removeItem(SESSION_KEY);
}

/* ─── Pings ─── */
export function getPingsForOwner(ownerId) {
  const all = read(PINGS_KEY) || {};
  return all[ownerId] || [];
}

export function savePing(ownerId, ping) {
  const all = read(PINGS_KEY) || {};
  if (!all[ownerId]) all[ownerId] = [];
  all[ownerId].unshift({ ...ping, id: Date.now(), createdAt: Date.now(), read: false });
  write(PINGS_KEY, all);
}

export function markPingsRead(ownerId) {
  const all = read(PINGS_KEY) || {};
  if (all[ownerId]) all[ownerId] = all[ownerId].map(p => ({ ...p, read: true }));
  write(PINGS_KEY, all);
}

export function getUnreadCount(ownerId) {
  return getPingsForOwner(ownerId).filter(p => !p.read).length;
}
