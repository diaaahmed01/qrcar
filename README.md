# QrCar 🚗

> **Connect with parked car owners instantly via QR code.**

## What It Does

QrCar lets any car owner place a QR code sticker on their windshield. When someone scans it, they see the owner's profile and can ping them via **WhatsApp**, **SMS**, or an **in-app notification** — without exchanging phone numbers directly.

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/register` | Register your car + get a QR code |
| `/dashboard` | View QR, see pings, edit profile |
| `/car/[id]` | **Public** — opened when QR is scanned |

---

## Architecture

```
qrcar/
├── pages/
│   ├── index.js          # Landing
│   ├── register.js       # 2-step registration
│   ├── dashboard.js      # Owner dashboard
│   └── car/[id].js       # Public profile (QR target) ← this is what people see
├── components/
│   ├── Layout.js         # Wrapper + SEO head
│   ├── Navbar.js         # Navigation
│   ├── PingModal.js      # Ping flow (reason → message → channel → sent)
│   └── QRCard.js         # QR display + download
├── lib/
│   └── store.js          # localStorage data layer (swap for DB later)
└── styles/
    └── globals.css       # Design tokens + utility classes
```

---

## Data Layer (MVP → Production)

Currently uses `localStorage` for zero-config MVP. To upgrade to production:

1. Replace `lib/store.js` functions with API calls
2. Set up a backend (Next.js API routes + Prisma + PostgreSQL recommended)
3. Add authentication (NextAuth.js)
4. Replace `uuid` with DB-generated IDs

Suggested schema:
```sql
-- owners
id, name, phone, whatsapp, email, plate, car, avatar, bio, created_at

-- pings  
id, owner_id, sender_name, reason, message, method, read, created_at
```

---

## Ping Channels

| Method | How It Works |
|--------|-------------|
| In-App | Saves to localStorage → visible in owner dashboard |
| WhatsApp | Opens `wa.me/` deep link with pre-filled message |
| SMS | Opens `sms:` protocol with pre-filled message |

---

## Demo

A demo profile (`demo-owner-001`) is auto-seeded on first visit. 
Navigate to `/car/demo-owner-001` to see the scanned-QR experience.

---

## Roadmap (Post-MVP)

- [ ] Real-time notifications (Pusher / Supabase Realtime)
- [ ] Push notifications (PWA)
- [ ] Multiple cars per owner
- [ ] QR sticker print-ready PDF generation
- [ ] Analytics dashboard
- [ ] Admin panel
- [ ] Reported/blocked users
