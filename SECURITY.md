# Security Documentation - Ascendos

## Security Architecture

### Authentication & Authorization

**Clerk Authentication**
- All user authentication handled by Clerk
- JWT tokens validated server-side via `@clerk/nextjs/server`
- Organization-based access control for multi-tenant isolation

**Authorization Levels**
| Role | Permissions |
|------|-------------|
| OWNER | Full organization access, billing, monitoring |
| ADMIN | Manage projects, users, settings |
| MEMBER | Create/edit projects, generate updates |

### Rate Limiting

**Implementation**: Upstash Redis-based rate limiting

| User Type | Limit | Window |
|-----------|-------|--------|
| Anonymous | 1 request | 1 hour |
| Trial | 5 generations | Trial period |
| Team | 10 generations | 24 hours |
| Agency | 50 generations | 24 hours |

**Security Features:**
- IP-based blocking for repeated violations
- Automatic alerts after 10+ blocks
- Request fingerprinting for abuse detection

---

## Secret Management

### Required Secrets

All secrets MUST be stored in Vercel environment variables, never in code.

| Secret | Rotation Frequency | Owner |
|--------|-------------------|-------|
| `DATABASE_URL` | On breach | DevOps |
| `CLERK_SECRET_KEY` | Annually | DevOps |
| `STRIPE_SECRET_KEY` | Annually | DevOps |
| `OPENAI_API_KEY` | Quarterly | DevOps |
| `UPSTASH_REDIS_REST_TOKEN` | Annually | DevOps |
| `CRON_SECRET` | Quarterly | DevOps |

### Secret Rotation Procedure

1. **Generate new secret** in the respective service dashboard
2. **Add new secret** to Vercel environment variables (don't remove old one yet)
3. **Deploy** to apply new secret
4. **Verify** application functionality
5. **Remove old secret** from service dashboard
6. **Remove old secret** from Vercel if using temporary dual-secret approach

### Never Store in Code

- API keys
- Database credentials
- Webhook secrets
- JWT signing keys
- Encryption keys

---

## Data Protection (GDPR)

### Data Classification

| Classification | Examples | Retention |
|----------------|----------|-----------|
| PII | Email, name | Account lifetime + 30 days |
| Business Data | Projects, updates | Account lifetime |
| Usage Data | Generations, tokens | 1 year |
| Security Logs | Rate limits, blocks | 90 days |

### PII Redaction

Automatic PII redaction is applied to:
- Log outputs (email, phone, SSN, IBAN)
- AI prompts (sensitive patterns)
- Export files (optional full redaction)

**Redacted Patterns:**
- Email addresses → `[EMAIL]`
- Phone numbers → `[PHONE]`
- French SSN → `[SSN]`
- IBAN → `[IBAN]`
- Names with titles → `[NOM]`
- Credit card numbers → `[CARD]`

### Data Purge

Automatic purge runs weekly (Sunday 3 AM UTC):
- Deletes PII for cancelled accounts after 30 days
- Removes orphaned data
- Cleans expired tokens

**Manual Purge Request:**
```bash
curl -X POST "https://your-domain/api/cron/data-purge?secret=$CRON_SECRET"
```

### Right to Deletion (Article 17)

To process a deletion request:

1. **Identify** all user data in database
2. **Export** data for user if requested (Article 20)
3. **Delete** user record (cascades to related data)
4. **Confirm** deletion to user within 30 days

```sql
-- Verify user data before deletion
SELECT * FROM "User" WHERE email = 'user@example.com';
SELECT * FROM "Project" WHERE "userId" = 'user_id';
SELECT * FROM "Update" WHERE "projectId" IN (SELECT id FROM "Project" WHERE "userId" = 'user_id');
```

---

## API Security

### CORS Policy

Configured in middleware:
- Allow only `ascendos.com` and verified subdomains
- Block requests from unknown origins
- Log rejected requests for monitoring

### Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://js.stripe.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
connect-src 'self' https://api.stripe.com https://api.openai.com;
frame-src https://js.stripe.com;
```

### Input Validation

**Server-side validation** via Zod schemas:
- All API inputs validated before processing
- Maximum length limits on text fields
- Type coercion and sanitization

**Prompt Injection Protection:**
- Pattern detection for common injection attempts
- Alert on suspicious patterns
- Request blocking for known attack signatures

---

## Incident Response

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| P1 Critical | Data breach, service down | 15 minutes |
| P2 High | Security vulnerability, degraded service | 1 hour |
| P3 Medium | Performance issues, minor bugs | 4 hours |
| P4 Low | Cosmetic issues, feature requests | 24 hours |

### Breach Response Checklist

1. **Contain** - Disable affected systems
2. **Assess** - Determine scope and impact
3. **Notify** - Inform affected users within 72 hours (GDPR)
4. **Remediate** - Fix vulnerability
5. **Document** - Post-mortem report
6. **Report** - CNIL notification if required

### Security Contacts

| Role | Responsibility |
|------|----------------|
| Security Lead | Incident coordination |
| DevOps | Infrastructure response |
| Legal | GDPR compliance, notifications |

---

## Monitoring & Alerting

### Security Events

Logged and optionally alerted:
- Failed authentication attempts
- Rate limit violations
- Suspicious origin requests
- Prompt injection attempts
- Webhook failures

### Alert Channels

| Channel | Events |
|---------|--------|
| Console | All events |
| Slack | Warning, Critical |
| Discord | Warning, Critical |
| Email | Critical only |

### Alert Configuration

Set in environment variables:
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
ALERT_EMAIL_TO=security@yourdomain.com
```

---

## Vulnerability Disclosure

### Responsible Disclosure

If you discover a security vulnerability:

1. **Do not** disclose publicly
2. **Email** security@yourdomain.com with details
3. **Include** steps to reproduce
4. **Wait** for acknowledgment (48 hours)
5. **Coordinate** disclosure timeline

### Bug Bounty

Currently no formal bug bounty program. Security researchers will be credited in the security hall of fame.

---

## Compliance Checklist

### GDPR (EU)

- [x] Privacy policy published
- [x] Cookie consent implemented
- [x] Data processing agreement available
- [x] Right to deletion process
- [x] Data export capability
- [x] 72-hour breach notification process

### SOC 2 (Future)

- [ ] Access control policies
- [ ] Change management
- [ ] Risk assessment
- [ ] Vendor management
- [ ] Incident response plan

---

## Security Hardening Checklist

### Production Deployment

- [x] All secrets in environment variables
- [x] HTTPS enforced (Vercel default)
- [x] Rate limiting enabled
- [x] Origin validation on anonymous endpoints
- [x] CRON_SECRET required for scheduled jobs
- [x] Role-based access on admin endpoints
- [x] PII redaction in logs

### Optional Enhancements

- [ ] WAF (Vercel Firewall or Cloudflare)
- [ ] IP allowlisting for admin routes
- [ ] Custom API key encryption
- [ ] Field-level encryption for rawInput
- [ ] Audit log for all data access
