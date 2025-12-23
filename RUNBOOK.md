# Operations Runbook - Ascendos

## Service Health

### Health Check Endpoint

```bash
curl https://your-domain.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "checks": {
    "database": "ok",
    "redis": "ok"
  }
}
```

**Unhealthy Response:**
```json
{
  "status": "unhealthy",
  "checks": {
    "database": "error",
    "redis": "ok"
  }
}
```

### Service Dependencies

| Service | Health Check | Impact if Down |
|---------|--------------|----------------|
| Vercel | Status page | Full outage |
| Neon DB | `SELECT 1` | Full outage |
| Upstash Redis | `PING` | Rate limiting fails |
| Clerk | API call | Auth fails |
| Stripe | Webhook test | Billing fails |
| OpenAI | API call | Generations fail |

---

## Common Scenarios

### Scenario 1: High Error Rate in Sentry

**Symptoms:**
- Spike in error count
- Multiple users affected

**Investigation:**
1. Check Sentry for error patterns
2. Review Vercel function logs
3. Check external service status pages

**Resolution:**
1. Identify root cause (code bug, service outage, etc.)
2. If code bug: Rollback to previous deployment
3. If service outage: Monitor and wait, notify users if extended

```bash
# View recent Vercel logs
vercel logs your-domain.vercel.app --follow
```

---

### Scenario 2: Rate Limiting Not Working

**Symptoms:**
- High volume of requests from single IP
- No blocks appearing in monitoring
- OpenAI costs spiking

**Investigation:**
1. Check Upstash Redis connection
2. Verify environment variables

```bash
# Test Redis connection
curl -X POST "$UPSTASH_REDIS_REST_URL/ping" \
  -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"
```

**Resolution:**
1. If Redis down: Check Upstash status page
2. If env vars missing: Add to Vercel and redeploy
3. If persistent: Implement emergency IP blocking

```bash
# Emergency: Block IP at Vercel level (if using Vercel Firewall)
# Or add to blocklist in code
```

---

### Scenario 3: Stripe Webhooks Failing

**Symptoms:**
- Subscriptions not updating
- Webhook errors in Stripe Dashboard

**Investigation:**
1. Check Stripe Dashboard > Developers > Webhooks
2. View webhook attempt logs
3. Verify webhook secret matches

**Resolution:**
1. If signature mismatch: Regenerate webhook secret, update env var
2. If endpoint error: Check Vercel function logs
3. Retry failed webhooks from Stripe Dashboard

```bash
# Test webhook endpoint manually
curl -X POST https://your-domain.vercel.app/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"type":"test"}'
# Expected: 400 (no signature)
```

---

### Scenario 4: OpenAI API Errors

**Symptoms:**
- Generations failing
- "API key invalid" or "Rate limit exceeded" errors

**Investigation:**
1. Check OpenAI status page
2. Verify API key is valid
3. Check usage limits

**Resolution:**
1. If rate limited: Wait or upgrade OpenAI plan
2. If key invalid: Regenerate key, update env var
3. If persistent: Enable Anthropic fallback

```bash
# Verify API key (sanitized)
echo $OPENAI_API_KEY | head -c 10
# Should show: sk-...
```

---

### Scenario 5: Database Connection Issues

**Symptoms:**
- 500 errors on most endpoints
- "Connection refused" in logs

**Investigation:**
1. Check Neon status page
2. Verify DATABASE_URL is correct
3. Check connection pool limits

**Resolution:**
1. If Neon outage: Wait and monitor
2. If connection string changed: Update env var
3. If pool exhausted: Restart deployment

```bash
# Test database connection
npx prisma db pull --url="$DATABASE_URL"
```

---

### Scenario 6: High Memory Usage

**Symptoms:**
- Function timeouts
- Slow response times
- "Memory exceeded" in logs

**Investigation:**
1. Check Vercel function metrics
2. Identify problematic endpoints
3. Review recent code changes

**Resolution:**
1. Optimize database queries (add indexes, limit results)
2. Reduce payload sizes
3. Increase function memory limit if needed

---

### Scenario 7: Cron Jobs Not Running

**Symptoms:**
- Weekly reminders not sent
- Data purge not happening

**Investigation:**
1. Check Vercel Dashboard > Crons
2. Verify CRON_SECRET is set
3. Check function logs for errors

**Resolution:**
1. If not configured: Verify vercel.json cron setup
2. If secret missing: Add CRON_SECRET env var
3. If failing: Check function logs for error details

```bash
# Manually trigger cron job
curl -X POST "https://your-domain.vercel.app/api/cron/weekly-reminders?secret=$CRON_SECRET"
```

---

### Scenario 8: User Cannot Log In

**Symptoms:**
- "Unauthorized" errors
- Redirect loops

**Investigation:**
1. Check Clerk status page
2. Verify Clerk env vars
3. Check user exists in Clerk Dashboard

**Resolution:**
1. If Clerk outage: Wait and monitor
2. If env vars incorrect: Fix and redeploy
3. If user issue: Reset user in Clerk Dashboard

---

## Operational Procedures

### Deploying a Hotfix

1. **Create branch** from main
   ```bash
   git checkout -b hotfix/issue-description
   ```

2. **Make fix** and test locally
   ```bash
   pnpm dev
   pnpm test
   ```

3. **Push and create PR**
   ```bash
   git push origin hotfix/issue-description
   ```

4. **Deploy to preview** (automatic on PR)

5. **Verify in preview** environment

6. **Merge and deploy** to production

7. **Verify in production**

---

### Rolling Back a Deployment

**Via Vercel Dashboard:**
1. Go to Project > Deployments
2. Find last working deployment
3. Click "..." > "Promote to Production"

**Via CLI:**
```bash
vercel rollback
```

---

### Database Migrations

**Deploy new migration:**
```bash
cd packages/database
pnpm prisma migrate deploy
```

**Check migration status:**
```bash
pnpm prisma migrate status
```

**Rollback migration (caution):**
```bash
pnpm prisma migrate resolve --rolled-back MIGRATION_NAME
# Then manually revert schema changes
```

---

### Rotating Secrets

1. **Generate new secret** in service dashboard
2. **Add to Vercel** (Settings > Environment Variables)
3. **Redeploy** to apply
4. **Verify** functionality
5. **Remove old secret** from service

---

### Blocking Malicious IP

**Temporary (Redis-based):**
```bash
# Block IP for 24 hours
curl -X POST "$UPSTASH_REDIS_REST_URL/setex/blocked:ip:1.2.3.4/86400/true" \
  -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"
```

**Permanent (Vercel Firewall):**
1. Go to Vercel Dashboard > Project > Settings > Security
2. Add IP to blocklist

---

### Viewing Logs

**Vercel logs:**
```bash
vercel logs your-domain.vercel.app --follow
```

**Filter by function:**
```bash
vercel logs your-domain.vercel.app --filter="/api/generate"
```

**Sentry (errors only):**
1. Go to Sentry Dashboard
2. Filter by environment: production

---

## Monitoring Dashboard

### Key Metrics

Access via `/api/admin/monitoring` (OWNER role required):

- **Organizations by plan** - TRIAL, TEAM, AGENCY distribution
- **Daily/Weekly generations** - Usage trends
- **Blocked IPs** - Security monitoring
- **Token usage** - LLM cost tracking

### Alerting Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| Error rate | >1% | >5% |
| Response time P95 | >2s | >5s |
| Blocked IPs/hour | >10 | >50 |
| OpenAI errors | >5% | >20% |

---

## Emergency Contacts

| Service | Status Page | Support |
|---------|-------------|---------|
| Vercel | status.vercel.com | support@vercel.com |
| Neon | neon.tech/status | support@neon.tech |
| Upstash | status.upstash.com | support@upstash.com |
| Clerk | status.clerk.com | support@clerk.com |
| Stripe | status.stripe.com | support@stripe.com |
| OpenAI | status.openai.com | help.openai.com |

---

## Maintenance Windows

**Recommended:**
- Saturday 2-4 AM UTC (minimal traffic)
- Announce 24 hours in advance for planned maintenance

**During maintenance:**
1. Enable maintenance mode (optional)
2. Perform changes
3. Run health checks
4. Disable maintenance mode
5. Monitor for issues
