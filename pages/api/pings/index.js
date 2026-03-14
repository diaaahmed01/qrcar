// pages/api/pings/index.js
import { createClient } from '@supabase/supabase-js'
import { getServiceClient } from '../../../lib/supabase'

export default async function handler(req, res) {

  // POST — anyone can create a ping (no auth needed)
  if (req.method === 'POST') {
    const { owner_id, sender_name, reason, label, message, method } = req.body
    if (!owner_id || !reason) return res.status(400).json({ error: 'owner_id and reason are required' })

    const supabase = getServiceClient()

    // Check owner exists
    const { data: owner } = await supabase.from('owners').select('id, name').eq('id', owner_id).single()
    if (!owner) return res.status(404).json({ error: 'Owner not found' })

    const { data, error } = await supabase
      .from('pings')
      .insert([{ owner_id, sender_name: sender_name || 'Anonymous', reason, label, message, method }])
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  // GET — owner fetches their own pings (auth required)
  if (req.method === 'GET') {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ error: 'Unauthorized' })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const serviceClient = getServiceClient()
    const { data, error } = await serviceClient
      .from('pings')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })

    // Mark all as read
    await serviceClient.from('pings').update({ read: true }).eq('owner_id', user.id).eq('read', false)

    return res.status(200).json(data)
  }

  return res.status(405).end()
}
