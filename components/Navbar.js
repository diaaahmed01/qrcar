// components/Navbar.js
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getUnreadCount } from '../lib/db'

export default function Navbar() {
  const router   = useRouter()
  const [user, setUser]         = useState(null)
  const [owner, setOwner]       = useState(null)
  const [unread, setUnread]     = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      setUser(session.user)
      const { data } = await supabase.from('owners').select('id,name').eq('id', session.user.id).single()
      if (data) { setOwner(data); setUnread(await getUnreadCount(data.id)) }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      setUser(session?.user ?? null)
      if (!session) { setOwner(null); setUnread(0) }
    })
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); subscription.unsubscribe() }
  }, [router.pathname])

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3 backdrop-blur-xl bg-[#07090F]/80 border-b border-[#1E2837]' : 'py-5'}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'var(--cyan)'}}>
            <span className="text-[#07090F] font-display font-800 text-sm leading-none">QR</span>
          </div>
          <span className="font-display font-700 text-xl tracking-wide" style={{color:'var(--text)'}}>QrCar</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {user ? (
            <>
              <Link href="/dashboard" className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{color: router.pathname==='/dashboard' ? 'var(--cyan)' : 'var(--sub)'}}>
                Dashboard
                {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold" style={{background:'var(--orange)',color:'#fff'}}>{unread}</span>}
              </Link>
              {owner && <Link href={`/car/${owner.id}`} className="px-4 py-2 rounded-lg text-sm font-medium" style={{color:'var(--sub)'}}>My Profile</Link>}
              <button onClick={logout} className="btn-ghost text-xs ml-2 px-4 py-2">Sign Out</button>
            </>
          ) : (
            <Link href="/register" className="btn-primary text-xs">Register Your Car</Link>
          )}
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 transition-all ${open?'rotate-45 translate-y-2':''}`} style={{background:'var(--text)'}} />
            <span className={`block w-6 h-0.5 transition-all ${open?'opacity-0':''}`} style={{background:'var(--text)'}} />
            <span className={`block w-6 h-0.5 transition-all ${open?'-rotate-45 -translate-y-2':''}`} style={{background:'var(--text)'}} />
          </div>
        </button>
      </div>
      {open && (
        <div className="md:hidden mt-2 mx-4 rounded-xl p-4 space-y-2" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
          {user ? (
            <>
              <Link href="/dashboard" className="block px-4 py-2.5 rounded-lg text-sm" style={{color:'var(--text)'}} onClick={()=>setOpen(false)}>Dashboard {unread>0&&`(${unread})`}</Link>
              {owner && <Link href={`/car/${owner.id}`} className="block px-4 py-2.5 rounded-lg text-sm" style={{color:'var(--text)'}} onClick={()=>setOpen(false)}>My Profile</Link>}
              <button onClick={logout} className="w-full text-left px-4 py-2.5 rounded-lg text-sm" style={{color:'var(--sub)'}}>Sign Out</button>
            </>
          ) : (
            <Link href="/register" className="btn-primary w-full justify-center" onClick={()=>setOpen(false)}>Register Your Car</Link>
          )}
        </div>
      )}
    </nav>
  )
}
