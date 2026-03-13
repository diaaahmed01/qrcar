// pages/register.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { saveOwner, setSession } from '../lib/store';

const AVATAR_SEEDS = ['Alex', 'Jordan', 'Morgan', 'Taylor', 'Casey', 'Riley', 'Sam', 'Drew', 'Blake', 'Cameron'];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep]     = useState(1); // 1 = personal, 2 = car, 3 = done
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name:      '',
    phone:     '',
    email:     '',
    whatsapp:  '',
    bio:       '',
    plate:     '',
    car:       '',
    avatarSeed: AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)],
  });

  const avatarUrl = `https://api.dicebear.com/8.x/notionists/svg?seed=${form.avatarSeed}&backgroundColor=0D1117`;

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }));
  }

  function validateStep1() {
    if (!form.name.trim())  { toast.error('Name is required'); return false; }
    if (!form.phone.trim()) { toast.error('Phone number is required'); return false; }
    return true;
  }

  function validateStep2() {
    if (!form.plate.trim()) { toast.error('License plate is required'); return false; }
    if (!form.car.trim())   { toast.error('Car description is required'); return false; }
    return true;
  }

  function handleNext() {
    if (step === 1 && validateStep1()) setStep(2);
  }

  async function handleSubmit() {
    if (!validateStep2()) return;
    setLoading(true);

    setTimeout(() => {
      const owner = {
        id:        uuidv4(),
        name:      form.name,
        phone:     form.phone,
        email:     form.email,
        whatsapp:  form.whatsapp || form.phone,
        bio:       form.bio || `Please ping me if my car is blocking you — I'll move it ASAP!`,
        plate:     form.plate.toUpperCase(),
        car:       form.car,
        avatar:    avatarUrl,
        createdAt: Date.now(),
      };
      saveOwner(owner);
      setSession(owner);
      setLoading(false);
      setStep(3);
      toast.success('Profile created!');
    }, 1000);
  }

  const progressPct = step === 1 ? 50 : step === 2 ? 100 : 100;

  return (
    <Layout title="Register" description="Register your car on QrCar">
      <div className="min-h-screen pt-28 pb-16 px-6 flex items-start justify-center">
        <div className="w-full max-w-lg">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--cyan)' }}>
              {step < 3 ? `Step ${step} of 2` : 'Complete!'}
            </p>
            <h1 className="font-display font-800 text-4xl mb-1" style={{ color: 'var(--text)' }}>
              {step === 1 ? 'Your Details' : step === 2 ? 'Your Car' : 'All Set! 🎉'}
            </h1>
            <p style={{ color: 'var(--sub)' }} className="text-sm">
              {step === 1 ? 'Tell people who to contact when they scan your QR.' :
               step === 2 ? 'Add your vehicle info so scanners can identify your car.' :
               'Your QR code is ready. Stick it on your windshield!'}
            </p>

            {/* Progress bar */}
            {step < 3 && (
              <div className="mt-4 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <motion.div className="h-full rounded-full" style={{ background: 'var(--cyan)' }}
                  initial={{ width: '0%' }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.4 }} />
              </div>
            )}
          </motion.div>

          {/* Form Card */}
          <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 space-y-5">

            {/* ─── Step 1: Personal ─── */}
            {step === 1 && (
              <>
                {/* Avatar picker */}
                <div className="flex items-center gap-4 pb-5" style={{ borderBottom: '1px solid var(--border)' }}>
                  <img src={avatarUrl} alt="avatar" className="w-16 h-16 rounded-full"
                    style={{ border: '2px solid var(--border)' }} />
                  <div>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Pick an avatar</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {AVATAR_SEEDS.map(s => (
                        <button key={s} onClick={() => set('avatarSeed', s)}
                          className="w-7 h-7 rounded-full overflow-hidden transition-all"
                          style={{ border: form.avatarSeed === s ? '2px solid var(--cyan)' : '2px solid transparent' }}>
                          <img src={`https://api.dicebear.com/8.x/notionists/svg?seed=${s}&backgroundColor=0D1117`}
                            alt={s} className="w-full h-full" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sub)' }}>Full Name *</label>
                  <input className="input-field" placeholder="Ahmed Al-Rashid" value={form.name}
                    onChange={e => set('name', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sub)' }}>Phone Number *</label>
                  <input className="input-field" placeholder="+20 100 000 0000" value={form.phone} type="tel"
                    onChange={e => set('phone', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sub)' }}>WhatsApp Number (if different)</label>
                  <input className="input-field" placeholder="Same as phone" value={form.whatsapp} type="tel"
                    onChange={e => set('whatsapp', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sub)' }}>Email (optional)</label>
                  <input className="input-field" placeholder="you@email.com" value={form.email} type="email"
                    onChange={e => set('email', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sub)' }}>Bio / Note for visitors</label>
                  <textarea className="input-field resize-none" rows={2}
                    placeholder="e.g. Please ping me, I'll move right away!"
                    value={form.bio} onChange={e => set('bio', e.target.value)} />
                </div>

                <button onClick={handleNext} className="btn-primary w-full justify-center py-3.5">
                  Continue →
                </button>
              </>
            )}

            {/* ─── Step 2: Car ─── */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sub)' }}>License Plate *</label>
                  <input className="input-field font-display font-700 text-xl tracking-widest uppercase"
                    placeholder="ABC 1234" value={form.plate}
                    onChange={e => set('plate', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sub)' }}>Car Description *</label>
                  <input className="input-field" placeholder="Toyota Camry 2022 — Silver"
                    value={form.car} onChange={e => set('car', e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setStep(1)} className="btn-ghost justify-center py-3.5">
                    ← Back
                  </button>
                  <button onClick={handleSubmit} disabled={loading} className="btn-primary justify-center py-3.5">
                    {loading ? (
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : 'Create Profile →'}
                  </button>
                </div>
              </>
            )}

            {/* ─── Step 3: Done ─── */}
            {step === 3 && (
              <div className="flex flex-col items-center gap-5 py-4 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center glow-cyan animate-pulse-cyan"
                  style={{ background: 'rgba(0,212,255,0.08)', border: '2px solid var(--cyan)' }}>
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--cyan)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-700 text-2xl mb-1" style={{ color: 'var(--text)' }}>
                    Welcome, {form.name.split(' ')[0]}!
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--sub)' }}>Your QR profile is live and ready to scan.</p>
                </div>
                <div className="grid grid-cols-1 gap-2 w-full">
                  <button onClick={() => router.push('/dashboard')} className="btn-primary justify-center py-3.5">
                    Go to Dashboard & Get QR →
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
