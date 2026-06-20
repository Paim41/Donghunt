import { supabase } from './supabaseClient';

// Email + password auth helpers plus a lightweight guest mode.
// Guest mode never touches Supabase Auth; it just flags the session locally.

const GUEST_KEY = 'donghunt:guest';

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  await supabase.auth.signOut();
  clearGuest();
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

export function onAuthChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return () => data.subscription.unsubscribe();
}

// --- Guest mode (no login) ---
export function enableGuest() {
  if (typeof window !== 'undefined') localStorage.setItem(GUEST_KEY, '1');
}
export function clearGuest() {
  if (typeof window !== 'undefined') localStorage.removeItem(GUEST_KEY);
}
export function isGuest() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(GUEST_KEY) === '1';
}
