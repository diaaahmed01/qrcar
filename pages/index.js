// pages/index.js
import Layout from '../components/Layout'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const STEPS = [
  { num: '01', title: 'Register Your Car', desc: 'Sign in with Google and create your profile in 2 minutes.' },
  { num: '02', title: 'Get Your QR Code', desc: 'A unique QR is generated. Print it, place it on your windshield.' },
  { num: '03', title: 'Someone Scans It', desc: 'Anyone who needs you scans the QR — no app needed on their end.' },
  { num: '04', title: 'Ping Sent', desc: 'They reach you via WhatsApp, SMS, or real-time in-app notification.' },
]

export default function HomePage() {


  const [user, setUser]       = useState(null)
  const [signingIn, setSignin] = useState(false)
const router = useRouter()
// Detect token in URL hash and redirect to callback
useEffect(() => {
  if (window.location.hash.includes('access_token')) {
    router.push('/auth/callback' + window.location.hash)
  }
}, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  async function handleGoogle() {
    setSignin(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { toast.error('Sign in failed'); setSignin(false) }
  }

  return (
    <Layout title="QrCar — Connect with parked drivers instantly">
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="badge mb-6 inline-flex px-4 py-1.5 text-xs tracking-widest uppercase"
            style={{ background: 'rgba(0,212,255,0.08)', color: 'var(--cyan)', border: '1px solid rgba(0,212,255,0.2)' }}>
            No App Required · Scan & Connect
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="font-display font-800 text-5xl sm:text-7xl leading-none mb-6"
            style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Your car, always<br /><span style={{ color: 'var(--cyan)' }}>reachable.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--sub)' }}>
            Place a QR sticker on your windshield. Anyone who needs you can reach you instantly — no numbers exchanged.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <Link href="/dashboard" className="btn-primary text-base px-8 py-4">Go to Dashboard →</Link>
            ) : (
              <button onClick={handleGoogle} disabled={signingIn}
                className="btn-primary text-base px-8 py-4 flex items-center justify-center gap-3">
                {signingIn
                  ? <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  : <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#07090F"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#07090F"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#07090F"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#07090F"/>
                    </svg>
                }
                {signingIn ? 'Signing in...' : 'Continue with Google — Free'}
              </button>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--cyan)' }}>How It Works</p>
            <h2 className="font-display font-700 text-4xl" style={{ color: 'var(--text)' }}>Four simple steps</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s, i) => (
              <motion.div key={s.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-5">
                <span className="font-display font-700 text-3xl opacity-20 block mb-4" style={{ color: 'var(--cyan)' }}>{s.num}</span>
                <h3 className="font-display font-700 text-lg mb-2" style={{ color: 'var(--text)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--sub)' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 glow-cyan">
            <h2 className="font-display font-700 text-4xl mb-4" style={{ color: 'var(--text)' }}>Ready to get started?</h2>
            <p className="mb-8" style={{ color: 'var(--sub)' }}>Free forever. No app needed. Works with any phone camera.</p>
            <button onClick={handleGoogle} disabled={signingIn} className="btn-primary text-base px-10 py-4">
              {signingIn ? 'Signing in...' : 'Register with Google — Free →'}
            </button>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 text-center" style={{ borderTop: '1px solid var(--border)', color: 'var(--sub)' }}>
        <p className="text-sm">© 2024 QrCar · Built for smarter parking</p>
      </footer>
    </Layout>
  )
}
