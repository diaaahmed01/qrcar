// pages/dashboard.js
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import QRCard from '../components/QRCard'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { subscribeToPings } from '../lib/db'

const METHOD_COLORS = {
  'in-app':   { bg:'rgba(0,212,255,0.08)',  border:'rgba(0,212,255,0.2)',  text:'#00D4FF', label:'📲 In-App' },
  'whatsapp': { bg:'rgba(37,211,102,0.08)', border:'rgba(37,211,102,0.2)', text:'#25D366', label:'💬 WhatsApp' },
  'sms':      { bg:'rgba(255,92,0,0.08)',   border:'rgba(255,92,0,0.2)',   text:'#FF5C00', label:'📱 SMS' },
}

export default function DashboardPage() {
  const router = useRouter()
  const [owner, setOwner]     = useState(null)
  const [pings, setPings]     = useState([])
  const [tab, setTab]         = useState('qr')
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving]   = useState(false)
  const [loading, setLoading] = useState(true)
  const channelRef            = useRef(null)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/'); return }

      // Load owner profile
      const { data: ownerData, error } = await supabase.from('owners').select('*').eq('id', session.user.id).single()
      if (error || !ownerData) { router.push('/register'); return }

      setOwner(ownerData)
      setEditForm(ownerData)

      // Load pings
      const res = await fetch('/api/pings', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      if (res.ok) setPings(await res.json())

      setLoading(false)

      // Real-time subscription
      channelRef.current = subscribeToPings(ownerData.id, (newPing) => {
        setPings(prev => [newPing, ...prev])
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-slide-up' : ''}`}
            style={{ background:'#121820', border:'1px solid var(--border)', borderRadius:'12px', padding:'14px 18px', display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'rgba(255,92,0,0.1)', border:'2px solid var(--orange)', display:'flex', alignItems:'center', justifyContent:'center' }}>🔔</div>
            <div>
              <p style={{ color:'var(--text)', fontSize:'14px', fontWeight:'600' }}>New Ping!</p>
              <p style={{ color:'var(--sub)', fontSize:'12px' }}>{newPing.label} · from {newPing.sender_name}</p>
            </div>
          </div>
        ), { duration: 5000 })
      })
    }
    init()
    return () => { if (channelRef.current) supabase.removeChannel(channelRef.current) }
  }, [])

  async function saveEdit() {
    setSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/owners', {
        method: 'PATCH',
        headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${session.access_token}` },
        body: JSON.stringify(editForm),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      const updated = await res.json()
      setOwner(updated)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <Layout title="Dashboard">
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border:'2px solid var(--border)', borderTopColor:'var(--cyan)' }} />
      </div>
    </Layout>
  )

  return (
    <Layout title="Dashboard">
      <div className="min-h-screen pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <img src={owner.avatar} alt="avatar" className="w-14 h-14 rounded-full" style={{ border:'2px solid var(--border)' }} />
            <div>
              <p className="text-xs mb-0.5" style={{ color:'var(--sub)' }}>Welcome back</p>
              <h1 className="font-display font-700 text-3xl" style={{ color:'var(--text)' }}>{owner.name}</h1>
              <p className="text-sm" style={{ color:'var(--sub)' }}>{owner.plate} · {owner.car}</p>
            </div>
          </div>

          <div className="flex gap-1 mb-8 p-1 rounded-xl w-fit" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
            {[{id:'qr',label:'My QR Code'},{id:'pings',label:`Pings (${pings.length})`},{id:'edit',label:'Edit Profile'}].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: tab===t.id ? 'var(--cyan)' : 'transparent', color: tab===t.id ? 'var(--bg)' : 'var(--sub)' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* QR Tab */}
          {tab === 'qr' && (
            <motion.div key="qr" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <QRCard owner={owner} />
              <div className="space-y-4">
                <div className="glass rounded-2xl p-5">
                  <p className="text-xs tracking-widest uppercase mb-3" style={{ color:'var(--cyan)' }}>Quick Stats</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ['Total Pings', pings.length],
                      ['This Week',   pings.filter(p=>new Date(p.created_at)>new Date(Date.now()-7*86400000)).length],
                      ['WhatsApp',    pings.filter(p=>p.method==='whatsapp').length],
                      ['SMS',         pings.filter(p=>p.method==='sms').length],
                    ].map(([l,v]) => (
                      <div key={l} className="rounded-xl p-4 text-center" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)' }}>
                        <p className="font-display font-700 text-2xl mb-0.5" style={{ color:'var(--cyan)' }}>{v}</p>
                        <p className="text-xs" style={{ color:'var(--sub)' }}>{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass rounded-2xl p-5">
                  <p className="text-xs tracking-widest uppercase mb-3" style={{ color:'var(--sub)' }}>Preview your public profile</p>
                  <a href={`/car/${owner.id}`} target="_blank" rel="noreferrer" className="btn-ghost w-full justify-center text-xs py-2.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    Open My QR Profile
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* Pings Tab */}
          {tab === 'pings' && (
            <motion.div key="pings" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
              {pings.length === 0 ? (
                <div className="glass rounded-2xl p-16 text-center">
                  <p className="font-display font-700 text-xl mb-1" style={{ color:'var(--text)' }}>No pings yet</p>
                  <p className="text-sm" style={{ color:'var(--sub)' }}>When someone scans your QR and pings you, it'll appear here in real-time.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pings.map((ping, i) => {
                    const m = METHOD_COLORS[ping.method] || METHOD_COLORS['in-app']
                    return (
                      <motion.div key={ping.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.04 }}
                        className="glass rounded-xl p-4 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background:'rgba(0,212,255,0.08)', border:'1px solid rgba(0,212,255,0.2)', color:'var(--cyan)' }}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-medium text-sm" style={{ color:'var(--text)' }}>{ping.sender_name || 'Anonymous'}</span>
                              <span className="badge text-xs px-2 py-0.5 rounded-full"
                                style={{ background:m.bg, border:`1px solid ${m.border}`, color:m.text }}>{m.label}</span>
                              {!ping.read && <span className="badge text-xs px-2 py-0.5 rounded-full" style={{ background:'rgba(255,92,0,0.1)', color:'var(--orange)' }}>New</span>}
                            </div>
                            <p className="text-sm" style={{ color:'var(--sub)' }}>{ping.label}</p>
                            {ping.message && <p className="text-xs mt-1" style={{ color:'var(--sub)' }}>"{ping.message}"</p>}
                          </div>
                        </div>
                        <p className="text-xs flex-shrink-0" style={{ color:'var(--sub)' }}>
                          {new Date(ping.created_at).toLocaleString([], { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                        </p>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* Edit Tab */}
          {tab === 'edit' && (
            <motion.div key="edit" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
              <div className="glass rounded-2xl p-6 max-w-lg space-y-4">
                {[
                  {f:'name',    l:'Full Name',      type:'text',  ph:'Your name'},
                  {f:'phone',   l:'Phone Number',    type:'tel',   ph:'+20 ...'},
                  {f:'whatsapp',l:'WhatsApp Number', type:'tel',   ph:'Same as phone'},
                  {f:'email',   l:'Email',           type:'email', ph:'you@email.com'},
                  {f:'plate',   l:'License Plate',   type:'text',  ph:'ABC 1234'},
                  {f:'car',     l:'Car Description', type:'text',  ph:'Toyota Camry ...'},
                ].map(({f,l,type,ph}) => (
                  <div key={f}>
                    <label className="block text-xs font-medium mb-1.5" style={{ color:'var(--sub)' }}>{l}</label>
                    <input className="input-field" type={type} placeholder={ph}
                      value={editForm[f] || ''} onChange={e => setEditForm(p => ({...p,[f]:e.target.value}))} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color:'var(--sub)' }}>Bio / Note</label>
                  <textarea className="input-field resize-none" rows={3}
                    value={editForm.bio || ''} onChange={e => setEditForm(p => ({...p,bio:e.target.value}))} />
                </div>
                <button onClick={saveEdit} disabled={saving} className="btn-primary w-full justify-center py-3.5">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  )
}
