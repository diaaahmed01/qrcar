// pages/index.js
import Layout from '../components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { seedDemoOwner } from '../lib/store';

const STEPS = [
  {
    num: '01',
    title: 'Register Your Car',
    desc: 'Create a profile with your name, photo, car details, and contact info.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Get Your QR Code',
    desc: 'A unique QR is generated for your car. Print it and place it on your windshield.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Someone Scans It',
    desc: 'If someone needs to reach you, they scan the QR with any camera app.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Ping Sent',
    desc: 'They see your profile and ping you via WhatsApp, SMS, or in-app notification.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const [demoId, setDemoId] = useState('demo-owner-001');

  useEffect(() => {
    const d = seedDemoOwner();
    setDemoId(d.id);
  }, []);

  return (
    <Layout title="QrCar — Connect with parked drivers instantly">
      {/* ─── Hero ─── */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="badge mb-6 inline-flex px-4 py-1.5 text-xs tracking-widest uppercase"
              style={{ background: 'rgba(0,212,255,0.08)', color: 'var(--cyan)', border: '1px solid rgba(0,212,255,0.2)' }}>
              No App Required · Scan & Connect
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="font-display font-800 text-5xl sm:text-7xl leading-none mb-6"
            style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Your car, always <br />
            <span style={{ color: 'var(--cyan)' }}>reachable.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-lg max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'var(--sub)' }}>
            Place a QR code on your windshield. Anyone who needs you — whether you're blocking them,
            left your lights on, or anything else — can reach you in seconds.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="btn-primary text-base px-8 py-4">
              Register Your Car Free →
            </Link>
            <Link href={`/car/${demoId}`} className="btn-ghost text-base px-8 py-4">
              View Demo Profile
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center mb-14">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--cyan)' }}>How It Works</p>
            <h2 className="font-display font-700 text-4xl" style={{ color: 'var(--text)' }}>Four simple steps</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s, i) => (
              <motion.div key={s.num}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-5 group hover:border-[var(--cyan)] transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(0,212,255,0.08)', color: 'var(--cyan)' }}>
                    {s.icon}
                  </div>
                  <span className="font-display font-700 text-3xl opacity-20" style={{ color: 'var(--cyan)' }}>{s.num}</span>
                </div>
                <h3 className="font-display font-700 text-lg mb-2" style={{ color: 'var(--text)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--sub)' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Feature Highlights ─── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--cyan)' }}>Privacy First</p>
            <h2 className="font-display font-700 text-4xl mb-5" style={{ color: 'var(--text)' }}>
              You control what<br />people can see
            </h2>
            <p className="mb-8 leading-relaxed" style={{ color: 'var(--sub)' }}>
              Your phone number and email are never shown directly on the public profile. All contact goes through our
              anonymous ping system until you choose to respond.
            </p>
            <div className="space-y-3">
              {['Anonymous pings protect your details', 'You decide when to share your number', 'Block or flag abusive pingers', 'Ping history visible only to you'].map(f => (
                <div key={f} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--cyan)' }}>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mock profile card */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="glass rounded-2xl p-6 glow-cyan">
              <div className="flex items-center gap-4 mb-5">
                <img src="https://api.dicebear.com/8.x/notionists/svg?seed=Ahmed&backgroundColor=0D1117"
                  className="w-14 h-14 rounded-full" style={{ border: '2px solid var(--border)' }} alt="avatar" />
                <div>
                  <h3 className="font-display font-700 text-xl" style={{ color: 'var(--text)' }}>Ahmed Al-Rashid</h3>
                  <p className="text-sm" style={{ color: 'var(--sub)' }}>Toyota Camry 2022 · ABC 1234</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-5 pb-5" style={{ color: 'var(--sub)', borderBottom: '1px solid var(--border)' }}>
                "Please ping me if my car is blocking you — I'll move it ASAP!"
              </p>
              <button className="btn-orange w-full justify-center py-3">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Ping This Driver
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass rounded-3xl p-12 glow-cyan">
            <h2 className="font-display font-700 text-4xl mb-4" style={{ color: 'var(--text)' }}>
              Ready to get started?
            </h2>
            <p className="mb-8" style={{ color: 'var(--sub)' }}>Free forever. No app to download. Works with any phone camera.</p>
            <Link href="/register" className="btn-primary text-base px-10 py-4">
              Register Your Car →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center" style={{ borderTop: '1px solid var(--border)', color: 'var(--sub)' }}>
        <p className="text-sm">© 2024 QrCar · Built with ❤️ for smarter parking</p>
      </footer>
    </Layout>
  );
}
