// pages/auth/callback.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    async function handleCallback() {
      // Exchange the code for a session
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session) {
        router.push('/?error=auth')
        return
      }

      // Check if owner profile exists
      const { data: owner } = await supabase
        .from('owners')
        .select('id')
        .eq('id', session.user.id)
        .single()

      if (owner) {
        router.push('/dashboard')
      } else {
        router.push('/register')
      }
    }

    handleCallback()
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#07090F',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        border: '2px solid #1E2837', borderTopColor: '#00D4FF',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#8896A8', fontSize: '14px' }}>Signing you in...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
