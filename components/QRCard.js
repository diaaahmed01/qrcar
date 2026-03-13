// components/QRCard.js
import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function QRCard({ owner, baseUrl }) {
  const [url, setUrl]       = useState('');
  const [copied, setCopied] = useState(false);
  const qrRef               = useRef(null);

  useEffect(() => {
    const base = baseUrl || window.location.origin;
    setUrl(`${base}/car/${owner.id}`);
  }, [owner.id, baseUrl]);

  function copyLink() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadQR() {
    // Convert SVG to canvas to PNG
    const svg    = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas  = document.createElement('canvas');
    const size    = 400;
    canvas.width  = size;
    canvas.height = size;
    const ctx     = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      // White background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 20, 20, size - 40, size - 40);

      const link    = document.createElement('a');
      link.download = `qrcar-${owner.plate?.replace(/\s/g,'-') || owner.id}.png`;
      link.href     = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border)' }}>
        <div>
          <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--sub)' }}>YOUR QR CODE</p>
          <p className="font-display font-700 text-lg" style={{ color: 'var(--text)' }}>{owner.plate}</p>
        </div>
        <span className="badge px-3 py-1 text-xs" style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--cyan)', border: '1px solid rgba(0,212,255,0.2)' }}>
          Active
        </span>
      </div>

      {/* QR */}
      <div className="p-6 flex flex-col items-center gap-4">
        <div ref={qrRef} className="p-4 rounded-xl" style={{ background: '#fff' }}>
          {url && (
            <QRCodeSVG
              value={url}
              size={180}
              bgColor="#ffffff"
              fgColor="#07090F"
              level="H"
              includeMargin={false}
            />
          )}
        </div>

        <div className="w-full">
          <p className="text-xs text-center mb-3 truncate px-2" style={{ color: 'var(--sub)' }}>{url}</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={copyLink} className="btn-ghost text-xs justify-center py-2.5">
              {copied ? (
                <><span>✓</span> Copied!</>
              ) : (
                <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg> Copy Link</>
              )}
            </button>
            <button onClick={downloadQR} className="btn-primary text-xs justify-center py-2.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Footer tip */}
      <div className="px-5 pb-5">
        <p className="text-xs text-center" style={{ color: 'var(--sub)' }}>
          Print & stick on your windshield or dashboard
        </p>
      </div>
    </div>
  );
}
