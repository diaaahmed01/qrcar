// pages/register.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'

const SEEDS = ['Ahmed','Jordan','Morgan','Taylor','Casey','Riley','Sam','Drew','Blake','Cameron']

export default function RegisterPage() {
  const router = useRouter()
  const [user, setUser]     = useState(null)
  const [step, setStep]     = useState(1)
  const [loading, setLoad]  = useState(false)
  const [seed, setSeed]     = useState(SEEDS[0])
  const [form, setForm]     = useState({ name:'', phone:'', whatsapp:'', bio:'', plate:'', car:'' })

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/'); return }
      setUser(session.user)
      // Pre-fill name from Google
      if (session.user.user_metadata?.full_name) {
        setForm(f => ({ ...f, name: session.user.user_metadata.full_name }))
      }
      if (session.user.user_metadata?.avatar_url) {
        setSeed(session.user.user_metadata.full_name?.split(' ')[0] || SEEDS[0])
      }
      // If already has profile, go to dashboard
      const { data } = await supabase.from('owners').select('id').eq('id', session.user.id).single()
      if (data) router.push('/dashboard')
    })
  }, [])

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }))
  const avatarUrl = `https://api.dicebear.com/8.x/notionists/svg?seed=${seed}&backgroundColor=0D1117`

  function validateStep1() {
    if (!form.name.trim())  { toast.error('Name is required'); return false }
    if (!form.phone.trim()) { toast.error('Phone number is required'); return false }
    return true
  }
  function validateStep2() {
    if (!form.plate.trim()) { toast.error('License plate is required'); return false }
    if (!form.car.trim())   { toast.error('Car description is required'); return false }
    return true
  }

  async function handleSubmit() {
    if (!validateStep2()) return
    setLoad(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/owners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ ...form, avatar: avatarUrl }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Profile created!')
      router.push('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoad(false)
    }
  }

  return (
    <Layout title="Register" description="Register your car on QrCar">
      <div className="min-h-screen pt-28 pb-16 px-6 flex items-start justify-center">
        <div className="w-full max-w-lg">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--cyan)' }}>Step {step} of 2</p>
            <h1 className="font-display font-800 text-4xl mb-1" style={{ color: 'var(--text)' }}>
              {step === 1 ? 'Your Details' : 'Your Car'}
            </h1>
            <p style={{ color: 'var(--sub)' }} className="text-sm">
              {step === 1 ? 'Tell visitors who to contact when they scan your QR.' : 'Add your vehicle info.'}
            </p>
            <div className="mt-4 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <motion.div className="h-full rounded-full" style={{ background: 'var(--cyan)' }}
                initial={{ width: '0%' }} animate={{ width: step === 1 ? '50%' : '100%' }} transition={{ duration: 0.4 }} />
            </div>
          </motion.div>

          <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 space-y-5">
            {step === 1 && (
              <>
                <div className="flex items-center gap-4 pb-5" style={{ borderBottom: '1px solid var(--border)' }}>
                  <img src={avatarUrl} alt="avatar" className="w-16 h-16 rounded-full" style={{ border: '2px solid var(--border)' }} />
                  <div>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Pick an avatar</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {SEEDS.map(s => (
                        <button key={s} onClick={() => setSeed(s)}
                          className="w-7 h-7 rounded-full overflow-hidden transition-all"
                          style={{ border: seed === s ? '2px solid var(--cyan)' : '2px solid transparent' }}>
                          <img src={`https://api.dicebear.com/8.x/notionists/svg?seed=${s}&backgroundColor=0D1117`} alt={s} className="w-full h-full" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div><label className="label">Full Name *</label><input className="inp input-field" placeholder="Ahmed Al-Rashid" value={form.name} onChange={e => set('name', e.target.value)} /></div>
                <div><label className="label">Phone Number *</label><input className="inp input-field" placeholder="+20 100 000 0000" value={form.phone} type="tel" onChange={e => set('phone', e.target.value)} /></div>
                <div><label className="label">WhatsApp (if different)</label><input className="inp input-field" placeholder="Same as phone" value={form.whatsapp} type="tel" onChange={e => set('whatsapp', e.target.value)} /></div>
                <div><label className="label">Bio / Note for visitors</label><textarea className="inp input-field resize-none" rows={2} placeholder="Please ping me, I'll move right away!" value={form.bio} onChange={e => set('bio', e.target.value)} /></div>
                <button onClick={() => validateStep1() && setStep(2)} className="btn-primary w-full justify-center py-3.5">Continue →</button>
              </>
            )}
            {step === 2 && (
              <>
                <div><label className="label">License Plate *</label>
                  <input className="inp input-field font-display font-700 text-xl tracking-widest uppercase" placeholder="ABC 1234" value={form.plate} onChange={e => set('plate', e.target.value)} /></div>
                <div><label className="label">Car Description *</label>
                  <input className="inp input-field" placeholder="Toyota Camry 2022 — Silver" value={form.car} onChange={e => set('car', e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setStep(1)} className="btn-ghost justify-center py-3.5">← Back</button>
                  <button onClick={handleSubmit} disabled={loading} className="btn-primary justify-center py-3.5">
                    {loading ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> : 'Create Profile →'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}
