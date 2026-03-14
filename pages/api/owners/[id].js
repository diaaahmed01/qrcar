// pages/api/owners/[id].js
import { getServiceClient } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { id } = req.query
  const supabase = getServiceClient()

  const { data, error } = await supabase
    .from('owners')
    .select('id, name, phone, whatsapp, email, plate, car, avatar, bio, created_at')
    .eq('id', id)
    .single()

  if (error || !data) return res.status(404).json({ error: 'Owner not found' })
  return res.status(200).json(data)
}
