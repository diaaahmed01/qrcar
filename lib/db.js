// lib/db.js — all Supabase data operations

import { supabase } from './supabase'

/* ─── Auth ─── */
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) throw error
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/* ─── Owners ─── */
export async function getOwnerById(id) {
  const { data, error } = await supabase
    .from('owners')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function getOwnerByUserId(userId) {
  const { data, error } = await supabase
    .from('owners')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

export async function createOwner(owner) {
  const { data, error } = await supabase
    .from('owners')
    .insert([owner])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateOwner(id, updates) {
  const { data, error } = await supabase
    .from('owners')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

/* ─── Pings ─── */
export async function getPingsForOwner(ownerId) {
  const { data, error } = await supabase
    .from('pings')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data
}

export async function createPing(ping) {
  const { data, error } = await supabase
    .from('pings')
    .insert([ping])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function markPingsRead(ownerId) {
  const { error } = await supabase
    .from('pings')
    .update({ read: true })
    .eq('owner_id', ownerId)
    .eq('read', false)
  if (error) console.error('markPingsRead:', error)
}

export async function getUnreadCount(ownerId) {
  const { count, error } = await supabase
    .from('pings')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', ownerId)
    .eq('read', false)
  if (error) return 0
  return count
}

/* ─── Real-time ping subscription ─── */
export function subscribeToPings(ownerId, onNewPing) {
  return supabase
    .channel(`pings:${ownerId}`)
    .on(
      'postgres_changes',
      {
        event:  'INSERT',
        schema: 'public',
        table:  'pings',
        filter: `owner_id=eq.${ownerId}`,
      },
      (payload) => onNewPing(payload.new)
    )
    .subscribe()
}
