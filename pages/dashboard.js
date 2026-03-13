// pages/dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import QRCard from '../components/QRCard';
import { motion } from 'framer-motion';
import { getSession, getPingsForOwner, markPingsRead, updateOwner, setSession } from '../lib/store';
import toast from 'react-hot-toast';

const METHOD_COLORS = {
  'in-app':  { bg: 'rgba(0,212,255,0.08)',  border: 'rgba(0,212,255,0.2)',  text: '#00D4FF', label: '📲 In-App' },
  'whatsapp':{ bg: 'rgba(37,211,102,0.08)', border: 'rgba(37,211,102,0.2)', text: '#25D366', label: '💬 WhatsApp' },
  'sms':     { bg: 'rgba(255,92,0,0.08)',   border: 'rgba(255,92,0,0.2)',   text: '#FF5C00', label: '📱 SMS' },
};

export default function DashboardPage() {
  const router  = useRouter();
  const [owner, setOwner]   = useState(null);
  const [pings, setPings]   = useState([]);
  const [tab, setTab]       = useState('qr');       // qr | pings | edit
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) { router.push('/register'); return; }
    setOwner(s);
    setEditForm(s);
    const p = getPingsForOwner(s.id);
    setPings(p);
    markPingsRead(s.id);
  }, []);

  function handleEditSave() {
    setSaving(true);
    setTimeout(() => {
      const updated = updateOwner(owner.id, editForm);
      setOwner(updated);
      setSession(updated);
      setSaving(false);
      toast.success('Profile updated!');
    }, 600);
  }

  function setEdit(field, val) {
    setEditForm(f => ({ ...f, [field]: val }));
  }

  if (!owner) return (
    <Layout title="Dashboard">
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full animate-spin border-2 border-t-transparent" style={{ borderColor: 'var(--cyan)', borderTopColor: 'transparent' }} />
      </div>
    </Layout>
  );

  const unreadCount = pings.filter(p => !p.read).length;

  return (
    <Layout title="Dashboard">
      <div className="min-h-screen pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <img src={owner.avatar} alt="avatar" className="w-14 h-14 rounded-full"
              style={{ border: '2px solid var(--border)' }} />
            <div>
              <p className="text-xs mb-0.5" style={{ color: 'var(--sub)' }}>Welcome back</p>
              <h1 className="font-display font-700 text-3xl" style={{ color: 'var(--text)' }}>{owner.name}</h1>
              <p className="text-sm" style={{ color: 'var(--sub)' }}>{owner.plate} · {owner.car}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 p-1 rounded-xl w-fit" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            {[
              { id: 'qr',    label: 'My QR Code' },
              { id: 'pings', label: `Pings${pings.length > 0 ? ` (${pings.length})` : ''}` },
              { id: 'edit',  label: 'Edit Profile' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: tab === t.id ? 'var(--cyan)' : 'transparent',
                  color:      tab === t.id ? 'var(--bg)' : 'var(--sub)',
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ─── Tab: QR ─── */}
          {tab === 'qr' && (
            <motion.div key="qr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <QRCard owner={owner} />

              <div className="space-y-4">
                <div className="glass rounded-2xl p-5">
                  <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--cyan)' }}>Quick Stats</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Total Pings', value: pings.length },
                      { label: 'This Week',   value: pings.filter(p => p.createdAt > Date.now() - 7 * 86400000).length },
                      { label: 'WhatsApp',    value: pings.filter(p => p.method === 'whatsapp').length },
                      { label: 'SMS',         value: pings.filter(p => p.method === 'sms').length },
                    ].map(s => (
                      <div key={s.label} className="rounded-xl p-4 text-center"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                        <p className="font-display font-700 text-2xl mb-0.5" style={{ color: 'var(--cyan)' }}>{s.value}</p>
                        <p className="text-xs" style={{ color: 'var(--sub)' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-2xl p-5">
                  <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--sub)' }}>Your Public Link</p>
                  <a href={`/car/${owner.id}`} target="_blank" rel="noreferrer"
                    className="btn-ghost w-full justify-center text-xs py-2.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Preview Your Profile
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Tab: Pings ─── */}
          {tab === 'pings' && (
            <motion.div key="pings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {pings.length === 0 ? (
                <div className="glass rounded-2xl p-16 text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--sub)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <p className="font-display font-700 text-xl mb-1" style={{ color: 'var(--text)' }}>No pings yet</p>
                  <p className="text-sm" style={{ color: 'var(--sub)' }}>When someone scans your QR and pings you, it'll appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pings.map((ping, i) => {
                    const m = METHOD_COLORS[ping.method] || METHOD_COLORS['in-app'];
                    return (
                      <motion.div key={ping.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass rounded-xl p-4 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: 'var(--cyan)' }}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>
                                {ping.senderName || 'Anonymous'}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full"
                                style={{ background: m.bg, border: `1px solid ${m.border}`, color: m.text }}>
                                {m.label}
                              </span>
                            </div>
                            <p className="text-sm font-medium" style={{ color: 'var(--sub)' }}>{ping.label}</p>
                            {ping.message && (
                              <p className="text-xs mt-1 truncate" style={{ color: 'var(--sub)' }}>"{ping.message}"</p>
                            )}
                          </div>
                        </div>
                        <p className="text-xs flex-shrink-0" style={{ color: 'var(--sub)' }}>
                          {new Date(ping.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ─── Tab: Edit ─── */}
          {tab === 'edit' && (
            <motion.div key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="glass rounded-2xl p-6 max-w-lg space-y-4">
                {[
                  { field: 'name',     label: 'Full Name',         type: 'text',  placeholder: 'Your name' },
                  { field: 'phone',    label: 'Phone Number',       type: 'tel',   placeholder: '+20 ...' },
                  { field: 'whatsapp', label: 'WhatsApp Number',    type: 'tel',   placeholder: 'Same as phone' },
                  { field: 'email',    label: 'Email',              type: 'email', placeholder: 'you@email.com' },
                  { field: 'plate',    label: 'License Plate',      type: 'text',  placeholder: 'ABC 1234' },
                  { field: 'car',      label: 'Car Description',    type: 'text',  placeholder: 'Toyota Camry ...' },
                ].map(({ field, label, type, placeholder }) => (
                  <div key={field}>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sub)' }}>{label}</label>
                    <input className="input-field" type={type} placeholder={placeholder}
                      value={editForm[field] || ''} onChange={e => setEdit(field, e.target.value)} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sub)' }}>Bio / Note</label>
                  <textarea className="input-field resize-none" rows={3} placeholder="Message to visitors..."
                    value={editForm.bio || ''} onChange={e => setEdit('bio', e.target.value)} />
                </div>
                <button onClick={handleEditSave} disabled={saving} className="btn-primary w-full justify-center py-3.5">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
