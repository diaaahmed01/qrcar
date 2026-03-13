// components/PingModal.js
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { savePing } from '../lib/store';

const PING_REASONS = [
  { id: 'blocking', label: '🚗 Car is blocking me', urgent: true },
  { id: 'lights',   label: '💡 Lights left on' },
  { id: 'door',     label: '🚪 Door not closed' },
  { id: 'flat',     label: '🔴 Possible flat tire' },
  { id: 'other',    label: '💬 Other message' },
];

export default function PingModal({ owner, onClose }) {
  const [step, setStep]         = useState('reason'); // reason | message | sent
  const [reason, setReason]     = useState(null);
  const [message, setMessage]   = useState('');
  const [senderName, setSenderName] = useState('');
  const [sending, setSending]   = useState(false);

  const selectedReason = PING_REASONS.find(r => r.id === reason);

  function handleSendInApp() {
    setSending(true);
    setTimeout(() => {
      savePing(owner.id, {
        reason,
        label:      selectedReason?.label || reason,
        message,
        senderName: senderName || 'Anonymous',
        method:     'in-app',
      });
      setSending(false);
      setStep('sent');
    }, 1200);
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(
      `Hi ${owner.name}! [QrCar Alert] ${selectedReason?.label || ''}${message ? ' — ' + message : ''}`
    );
    const num = owner.whatsapp?.replace(/\D/g, '') || owner.phone?.replace(/\D/g, '');
    window.open(`https://wa.me/${num}?text=${text}`, '_blank');
    savePing(owner.id, {
      reason,
      label:      selectedReason?.label || reason,
      message,
      senderName: senderName || 'Anonymous',
      method:     'whatsapp',
    });
    setStep('sent');
  }

  function handleSMS() {
    const text = encodeURIComponent(
      `[QrCar] ${selectedReason?.label || ''} — ${message}`
    );
    const num = owner.phone?.replace(/\D/g, '');
    window.open(`sms:${num}?body=${text}`, '_blank');
    savePing(owner.id, {
      reason,
      label:      selectedReason?.label || reason,
      message,
      senderName: senderName || 'Anonymous',
      method:     'sms',
    });
    setStep('sent');
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Sheet */}
        <motion.div
          className="relative w-full max-w-md rounded-2xl p-6 z-10"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }} transition={{ type: 'spring', damping: 25 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--sub)' }}>Pinging</p>
              <h3 className="font-display font-700 text-xl" style={{ color: 'var(--text)' }}>
                {owner.name}
              </h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--sub)' }}>
              ×
            </button>
          </div>

          {/* Step: reason */}
          {step === 'reason' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--sub)' }}>Why are you pinging?</p>
              <div className="space-y-2">
                {PING_REASONS.map(r => (
                  <button key={r.id}
                    onClick={() => { setReason(r.id); setStep('message'); }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-150"
                    style={{
                      background:  reason === r.id ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.03)',
                      border:      `1px solid ${reason === r.id ? 'var(--cyan)' : 'var(--border)'}`,
                      color:       r.urgent ? 'var(--orange)' : 'var(--text)',
                    }}>
                    {r.label}
                    {r.urgent && (
                      <span className="badge text-[10px] px-2 py-0.5" style={{ background: 'rgba(255,92,0,0.15)', color: 'var(--orange)' }}>
                        URGENT
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step: message */}
          {step === 'message' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <span className="text-sm">{selectedReason?.label}</span>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sub)' }}>Your name (optional)</label>
                <input className="input-field" placeholder="e.g. Karim" value={senderName} onChange={e => setSenderName(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sub)' }}>Add a note (optional)</label>
                <textarea className="input-field resize-none" rows={3} placeholder="e.g. I'm parked right behind you in the blue Honda..."
                  value={message} onChange={e => setMessage(e.target.value)} />
              </div>

              <p className="text-xs font-medium" style={{ color: 'var(--sub)' }}>Send via:</p>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={handleSendInApp} disabled={sending}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all"
                  style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', color: 'var(--cyan)' }}>
                  {sending ? (
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  )}
                  In-App
                </button>

                <button onClick={handleWhatsApp}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all"
                  style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.25)', color: '#25D366' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>

                <button onClick={handleSMS}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all"
                  style={{ background: 'rgba(255,92,0,0.08)', border: '1px solid rgba(255,92,0,0.25)', color: 'var(--orange)' }}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  SMS
                </button>
              </div>

              <button onClick={() => setStep('reason')} className="w-full text-center text-xs py-1 transition-colors"
                style={{ color: 'var(--sub)' }}>
                ← Back
              </button>
            </motion.div>
          )}

          {/* Step: sent */}
          {step === 'sent' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center glow-cyan animate-pulse-cyan"
                style={{ background: 'rgba(0,212,255,0.1)', border: '2px solid var(--cyan)' }}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: 'var(--cyan)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-display font-700 text-xl mb-1" style={{ color: 'var(--text)' }}>Ping Sent!</h4>
                <p className="text-sm" style={{ color: 'var(--sub)' }}>{owner.name} has been notified. They should respond shortly.</p>
              </div>
              <button onClick={onClose} className="btn-primary mt-2 px-8">Done</button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
