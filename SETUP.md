# C1ph3r Fsociety — Setup Guide

## Prerequisites

- Node.js 20+
- npm or pnpm
- A [Supabase](https://supabase.com) project (free tier works)
- A [Vercel](https://vercel.com) account for deployment
- [Razorpay](https://razorpay.com) account (India)
- [PayPal Developer](https://developer.paypal.com) account

---

## 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/c1ph3r-fsociety
cd c1ph3r-fsociety
npm install
```

---

## 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`. See `.env.example` for documentation on each variable.

---

## 3. Supabase Setup

### 3a. Create a Supabase project
Go to https://supabase.com → New Project

### 3b. Run migrations
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push schema
supabase db push
```

Or paste the SQL from `supabase/migrations/` into the Supabase SQL Editor.

### 3c. Seed product data
Paste `supabase/seeds/001_products.sql` into the SQL Editor and run.

### 3d. Create admin user
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" → enter `rahulthegreat2001@gmail.com` and a strong password
3. The admin record in `admin_users` is already seeded

---

## 4. Payment Setup

### Razorpay
1. Sign up at https://razorpay.com
2. Get Key ID and Key Secret from Dashboard → Settings → API Keys
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```
4. Set up webhook at Dashboard → Settings → Webhooks → Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`

### PayPal
1. Go to https://developer.paypal.com → My Apps & Credentials
2. Create an app, get Client ID and Secret
3. Add to `.env.local`
4. Set up webhook at: `https://yourdomain.com/api/webhooks/paypal`

---

## 5. Email (SMTP)

### Gmail App Password (easiest)
1. Enable 2FA on your Google account
2. Go to Account → Security → App Passwords
3. Create one for "Mail"
4. Set `SMTP_USER=your@gmail.com` and `SMTP_PASS=the-app-password`

### SendGrid (recommended for production)
1. Sign up at https://sendgrid.com (free 100 emails/day)
2. Create an API key
3. Use `smtp.sendgrid.net`, port 587, username `apikey`, password = your API key

---

## 6. Run Locally

```bash
npm run dev
```

Open http://localhost:3000

Admin panel: http://localhost:3000/admin

---

## 7. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel Dashboard or:
vercel env add NEXT_PUBLIC_SUPABASE_URL
# ... etc for each variable
```

Or connect your GitHub repo to Vercel for automatic deployments on push.

---

## 8. Custom Domain

1. Add your domain in Vercel → Project → Settings → Domains
2. Add the DNS records Vercel provides to your Cloudflare DNS
3. Enable Cloudflare proxy (orange cloud) for DDoS protection

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public-facing pages
│   │   ├── page.tsx       # Home
│   │   ├── about/         # About Rahul
│   │   ├── research/      # Research projects
│   │   ├── speaking/      # Speaking & workshops
│   │   ├── media/         # Media gallery
│   │   ├── store/         # Product catalog + checkout
│   │   ├── blog/          # Blog
│   │   └── contact/       # Contact form
│   ├── (admin)/           # Admin dashboard
│   │   └── admin/
│   │       ├── page.tsx   # Dashboard overview
│   │       ├── products/  # Product management
│   │       ├── orders/    # Order management
│   │       ├── customers/ # Customer management
│   │       ├── blog/      # Blog management
│   │       ├── media/     # Media management
│   │       ├── speaking/  # Speaking management
│   │       ├── settings/  # Site settings
│   │       └── analytics/ # Analytics
│   └── api/               # API routes
├── components/
│   ├── ui/                # Reusable UI primitives
│   ├── layout/            # Navbar, Footer
│   ├── home/              # Home page sections
│   ├── store/             # Store components
│   └── admin/             # Admin components
├── context/               # Zustand stores (cart)
├── lib/
│   ├── supabase/          # Supabase clients
│   ├── email/             # Email templates
│   └── utils/             # Formatters, helpers
├── types/                 # TypeScript types
supabase/
├── migrations/            # SQL schema migrations
└── seeds/                 # Seed data (products, etc.)
```

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | Next.js 14 (App Router, TypeScript) |
| Styling     | Tailwind CSS                        |
| Database    | Supabase (PostgreSQL)               |
| Auth        | Supabase Auth                       |
| Payments    | Razorpay (India) + PayPal (Global)  |
| Email       | Nodemailer (SMTP)                   |
| Animations  | Framer Motion                       |
| State       | Zustand (cart)                      |
| Deployment  | Vercel                              |
| DNS/CDN     | Cloudflare                          |

---

## Adding New Products

1. Go to `/admin/products` → Add Product
2. Fill in name, slug, description, price, stock, images
3. Or insert directly into Supabase `products` table

## Managing Orders

1. Go to `/admin/orders`
2. Click any order to view details
3. Update status (confirmed → processing → shipped → delivered)
4. Add tracking number when shipped

## Writing Blog Posts

1. Go to `/admin/blog` → New Post
2. Write in Markdown (MDX supported)
3. Set as published when ready
