// pages/api/sms.js — Twilio SMS delivery
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { to, ownerName, reason, senderName, message } = req.body
  if (!to) return res.status(400).json({ error: 'Phone number required' })

  // Only load Twilio if env vars are set
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    return res.status(503).json({ error: 'SMS service not configured' })
  }

  try {
    const twilio = require('twilio')
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

    const body = [
      `🚗 QrCar Alert for ${ownerName}`,
      `From: ${senderName || 'Anonymous'}`,
      `Reason: ${reason}`,
      message ? `Note: ${message}` : null,
      `Reply to this number to respond.`,
    ].filter(Boolean).join('\n')

    const msg = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    })

    return res.status(200).json({ sid: msg.sid })
  } catch (err) {
    console.error('Twilio error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
