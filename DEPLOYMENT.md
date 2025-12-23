# Deployment Guide - Ascendos

## Prerequisites

Before deploying Ascendos, ensure you have:

1. **Vercel Account** - [vercel.com](https://vercel.com)
2. **Neon PostgreSQL Database** - [neon.tech](https://neon.tech)
3. **Upstash Redis** - [upstash.com](https://upstash.com) (required for rate limiting)
4. **Clerk Account** - [clerk.com](https://clerk.com)
5. **Stripe Account** - [stripe.com](https://stripe.com)
6. **OpenAI API Key** - [platform.openai.com](https://platform.openai.com)
7. **Resend Account** (optional) - [resend.com](https://resend.com)
8. **Sentry Account** (optional) - [sentry.io](https://sentry.io)

---

## Step 1: Database Setup (Neon)

### 1.1 Create Database

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project named `ascendos-prod`
3. Copy the connection string (pooled recommended)

### 1.2 Run Migrations

```bash
# Set DATABASE_URL in your terminal
export DATABASE_URL="postgresql://..."

# Run migrations
cd packages/database
pnpm prisma migrate deploy
```

### 1.3 Verify Schema

```bash
pnpm prisma studio
```

---

## Step 2: Redis Setup (Upstash)

### 2.1 Create Redis Instance

1. Go to [Upstash Console](https://console.upstash.com)
2. Create a new Redis database
3. Select region closest to your Vercel deployment (e.g., `eu-west-1` for EU)
4. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

### 2.2 Verify Connection

```bash
curl -X POST "$UPSTASH_REDIS_REST_URL/ping" \
  -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"
# Expected: {"result":"PONG"}
```

---

## Step 3: Clerk Setup

### 3.1 Create Application

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Enable Email authentication
4. Optional: Enable Google/GitHub OAuth

### 3.2 Configure Webhook

1. Go to **Webhooks** in Clerk Dashboard
2. Add endpoint: `https://your-domain.vercel.app/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`, `user.deleted`, `organization.created`, `organization.updated`
4. Copy the webhook signing secret

### 3.3 Environment Variables

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
```

---

## Step 4: Stripe Setup

### 4.1 Create Products

1. Go to [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
2. Create **TEAM** product:
   - Name: "Ascendos Team"
   - Price: 89.00 EUR/month (recurring)
   - Copy Price ID: `price_...`
3. Create **AGENCY** product:
   - Name: "Ascendos Agency"
   - Price: 169.00 EUR/month (recurring)
   - Copy Price ID: `price_...`

### 4.2 Configure Webhook

1. Go to **Developers > Webhooks**
2. Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the webhook signing secret

### 4.3 Environment Variables

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_TEAM_PRICE_ID=price_...
STRIPE_AGENCY_PRICE_ID=price_...
```

---

## Step 5: Vercel Deployment

### 5.1 Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your Git repository
3. Select `apps/web` as the root directory
4. Framework preset: Next.js

### 5.2 Configure Environment Variables

Add all required environment variables in Vercel project settings:

**Required:**
```
DATABASE_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_WEBHOOK_SECRET
OPENAI_API_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_TEAM_PRICE_ID
STRIPE_AGENCY_PRICE_ID
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
CRON_SECRET
```

**Recommended:**
```
RESEND_API_KEY
ANTHROPIC_API_KEY
SENTRY_DSN
NEXT_PUBLIC_SENTRY_DSN
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_POSTHOG_HOST
```

**Optional (Alerts):**
```
SLACK_WEBHOOK_URL
DISCORD_WEBHOOK_URL
ALERT_EMAIL_TO
```

### 5.3 Generate CRON_SECRET

```bash
openssl rand -base64 32
```

### 5.4 Deploy

```bash
vercel --prod
```

---

## Step 6: Post-Deployment Verification

### 6.1 Health Check

```bash
curl https://your-domain.vercel.app/api/health
# Expected: {"status":"healthy","checks":{"database":"ok","redis":"ok"}}
```

### 6.2 Smoke Tests

```bash
DEPLOYMENT_URL=https://your-domain.vercel.app pnpm smoke-test
```

### 6.3 Test Critical Flows

1. **Authentication**: Sign up, sign in, sign out
2. **Project Creation**: Create a project, add an update
3. **Generation**: Generate a sponsor update (uses trial credits)
4. **Billing**: Upgrade to TEAM plan via Stripe Checkout

---

## Step 7: Cron Jobs Setup

### 7.1 Configure vercel.json

The `vercel.json` file defines cron schedules:

```json
{
  "crons": [
    {
      "path": "/api/cron/weekly-reminders?secret=$CRON_SECRET",
      "schedule": "0 9 * * 1"
    },
    {
      "path": "/api/cron/data-purge?secret=$CRON_SECRET",
      "schedule": "0 3 * * 0"
    }
  ]
}
```

### 7.2 Verify Cron Execution

Check Vercel Dashboard > Project > Logs for cron execution logs.

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk public key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key |
| `CLERK_WEBHOOK_SECRET` | Yes | Clerk webhook signing secret |
| `OPENAI_API_KEY` | Yes | OpenAI API key for generations |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe public key |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `STRIPE_TEAM_PRICE_ID` | Yes | Stripe price ID for TEAM plan |
| `STRIPE_AGENCY_PRICE_ID` | Yes | Stripe price ID for AGENCY plan |
| `UPSTASH_REDIS_REST_URL` | Yes | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | Upstash Redis REST token |
| `CRON_SECRET` | Yes | Secret for cron job authentication |
| `RESEND_API_KEY` | No | Resend API key for emails |
| `ANTHROPIC_API_KEY` | No | Claude API key (fallback) |
| `SENTRY_DSN` | No | Sentry error tracking DSN |
| `NEXT_PUBLIC_POSTHOG_KEY` | No | PostHog analytics key |
| `SLACK_WEBHOOK_URL` | No | Slack webhook for alerts |
| `DISCORD_WEBHOOK_URL` | No | Discord webhook for alerts |
| `ALERT_EMAIL_TO` | No | Email for critical alerts |

---

## Rollback Procedure

### Vercel Rollback

1. Go to Vercel Dashboard > Project > Deployments
2. Find the previous working deployment
3. Click "..." > "Promote to Production"

### Database Rollback

```bash
# List migrations
pnpm prisma migrate status

# Rollback (if needed)
pnpm prisma migrate resolve --rolled-back MIGRATION_NAME
```

---

## Troubleshooting

### Common Issues

**Rate limiting not working:**
- Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set
- Check Redis connection in health endpoint

**Stripe webhooks failing:**
- Verify webhook signing secret matches
- Check Stripe Dashboard > Developers > Webhooks for errors

**Generations failing:**
- Check `OPENAI_API_KEY` is valid and has credits
- Check usage logs in admin monitoring

**Cron jobs not running:**
- Verify `CRON_SECRET` is set
- Check vercel.json cron configuration
- Review logs in Vercel Dashboard

### Support

For deployment issues, check:
1. Vercel deployment logs
2. Sentry error tracking
3. Application health endpoint
