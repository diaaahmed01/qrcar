// pages/car/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import PingModal from '../../components/PingModal';
import { getOwnerById } from '../../lib/store';

export default function CarProfilePage() {
  const router  = useRouter();
  const { id }  = router.query;

  const [owner, setOwner]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [showPing, setShowPing] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const o = getOwnerById(id);
    if (o) { setOwner(o); }
    else   { setNotFound(true); }
    setLoading(false);
  }, [id]);

  // Animate in
  const container = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1,  y: 0, transition: { duration: 0.4 } },
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 rounded-full animate-spin"
        style={{ border: '2px solid var(--border)', borderTopColor: 'var(--cyan)' }} />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center mesh-bg"
      style={{ background: 'var(--bg)' }}>
      <Head><title>Not Found · QrCar</title></Head>
      <div className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(255,92,0,0.1)', border: '2px solid rgba(255,92,0,0.3)', color: 'var(--orange)' }}>
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="font-display font-700 text-3xl" style={{ color: 'var(--text)' }}>Profile Not Found</h1>
      <p style={{ color: 'var(--sub)' }}>This QR code may have been deactivated or is invalid.</p>
      <a href="/" className="btn-primary mt-2">← Go to QrCar</a>
    </div>
  );

  return (
    <>
      <Head>
        <title>{owner.name} · QrCar</title>
        <meta name="description" content={`Contact ${owner.name} about their ${owner.car}.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen mesh-bg" style={{ background: 'var(--bg)', fontFamily: 'DM Sans, sans-serif', color: 'var(--text)' }}>
        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, var(--cyan), var(--orange))' }} />

        {/* Scan badge */}
        <div className="flex justify-center pt-6 pb-2">
          <span className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: 'var(--cyan)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--cyan)' }} />
            QR Scanned · Live Profile
          </span>
        </div>

        {/* Main card */}
        <motion.div variants={container} initial="hidden" animate="show"
          className="max-w-sm mx-auto px-4 pt-4 pb-10">

          {/* Profile card */}
          <motion.div variants={item} className="rounded-2xl overflow-hidden mb-4"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>

            {/* Banner */}
            <div className="h-20 relative" style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.12) 0%, rgba(255,92,0,0.08) 100%)',
            }}>
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <svg viewBox="0 0 200 60" className="w-full h-full fill-current" style={{ color: 'var(--cyan)' }}>
                  <text y="50" fontSize="60" fontFamily="Barlow Condensed" fontWeight="800" letterSpacing="8">QRCAR</text>
                </svg>
              </div>
              {/* Avatar overlap */}
              <div className="absolute -bottom-8 left-5">
                <img src={owner.avatar} alt={owner.name}
                  className="w-16 h-16 rounded-full"
                  style={{ border: '3px solid var(--card)', background: 'var(--surface)' }} />
              </div>
            </div>

            <div className="pt-10 pb-5 px-5">
              <h1 className="font-display font-800 text-2xl leading-tight mb-0.5" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                {owner.name}
              </h1>
              <p className="text-sm mb-3" style={{ color: 'var(--sub)' }}>{owner.car}</p>

              {owner.bio && (
                <p className="text-sm leading-relaxed p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--sub)' }}>
                  "{owner.bio}"
                </p>
              )}
            </div>
          </motion.div>

          {/* Plate badge */}
          <motion.div variants={item} className="flex justify-center mb-4">
            <div className="px-6 py-3 rounded-xl" style={{ background: 'var(--card)', border: '2px solid var(--border)' }}>
              <p className="font-display font-800 text-3xl tracking-widest text-center" style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.15em' }}>
                {owner.plate}
              </p>
            </div>
          </motion.div>

          {/* PING button — primary action */}
          <motion.div variants={item} className="mb-4">
            <button onClick={() => setShowPing(true)}
              className="w-full py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-3 transition-all glow-orange"
              style={{ background: 'var(--orange)', color: '#fff' }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Ping This Driver
            </button>
          </motion.div>

          {/* Quick contact options */}
          <motion.div variants={item} className="grid grid-cols-3 gap-2 mb-4">
            {/* WhatsApp */}
            <a href={`https://wa.me/${(owner.whatsapp || owner.phone).replace(/\D/g,'')}`}
              target="_blank" rel="noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all"
              style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)', color: '#25D366' }}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>

            {/* SMS */}
            <a href={`sms:${owner.phone}`}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all"
              style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)', color: 'var(--cyan)' }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              SMS
            </a>

            {/* Call */}
            <a href={`tel:${owner.phone}`}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--sub)' }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call
            </a>
          </motion.div>

          {/* Car info details */}
          <motion.div variants={item} className="rounded-2xl p-4 space-y-3"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--sub)' }}>Vehicle Info</p>
            {[
              { label: 'Owner',   value: owner.name },
              { label: 'Vehicle', value: owner.car },
              { label: 'Plate',   value: owner.plate },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between py-2"
                style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--sub)' }}>{r.label}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{r.value}</span>
              </div>
            ))}
          </motion.div>

          {/* Powered by */}
          <motion.div variants={item} className="text-center mt-6">
            <a href="/" className="text-xs" style={{ color: 'var(--sub)' }}>
              Powered by <span style={{ color: 'var(--cyan)' }}>QrCar</span> · Register your car free →
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Ping Modal */}
      {showPing && (
        <PingModal owner={owner} onClose={() => setShowPing(false)} />
      )}
    </>
  );
}
