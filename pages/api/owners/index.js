// pages/api/owners/index.js
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // Auth check
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )

  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) return res.status(401).json({ error: 'Unauthorized' })

  // POST — create owner profile
  if (req.method === 'POST') {
    const { name, phone, whatsapp, email, plate, car, bio, avatar } = req.body

    if (!name || !phone || !plate || !car)
      return res.status(400).json({ error: 'Missing required fields' })

    const { data, error } = await supabase
      .from('owners')
      .upsert({
        id: user.id,
        name,
        phone,
        whatsapp: whatsapp || phone,
        email:    email || user.email,
        plate:    plate.toUpperCase(),
        car,
        bio:      bio || "Please ping me if my car is blocking you — I'll move it ASAP!",
        avatar:   avatar || `https://api.dicebear.com/8.x/notionists/svg?seed=${name}&backgroundColor=0D1117`,
      })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // PATCH — update owner profile
  if (req.method === 'PATCH') {
    const allowed = ['name','phone','whatsapp','email','plate','car','bio','avatar']
    const updates = {}
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k] })
    if (updates.plate) updates.plate = updates.plate.toUpperCase()

    const { data, error } = await supabase
      .from('owners')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  return res.status(405).end()
}
