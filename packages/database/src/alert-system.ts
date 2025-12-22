/**
 * Système d'alertes pour les activités suspectes
 * Supporte : Console, Email (Resend), Slack, Discord
 */

export type AlertLevel = 'info' | 'warning' | 'critical';

export interface Alert {
  level: AlertLevel;
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

export class AlertSystem {
  /**
   * Envoie une alerte via console (toujours actif)
   */
  private logToConsole(alert: Alert): void {
    const emoji = {
      info: 'ℹ️',
      warning: '⚠️',
      critical: '🚨',
    }[alert.level];

    console.log(`\n${emoji} [${alert.level.toUpperCase()}] ${alert.title}`);
    console.log(alert.message);
    if (alert.metadata) {
      console.log('Metadata:', JSON.stringify(alert.metadata, null, 2));
    }
    console.log('---');
  }

  /**
   * Envoie une alerte par email (Resend)
   * Nécessite: RESEND_API_KEY et ALERT_EMAIL_TO dans .env
   */
  private async sendEmail(alert: Alert): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;
    const emailTo = process.env.ALERT_EMAIL_TO;

    if (!apiKey || !emailTo) {
      console.warn('⚠️  Email alerts not configured (missing RESEND_API_KEY or ALERT_EMAIL_TO)');
      return;
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Security Alerts <alerts@yourdomain.com>',
          to: emailTo,
          subject: `[${alert.level.toUpperCase()}] ${alert.title}`,
          html: `
            <h2>${alert.title}</h2>
            <p>${alert.message}</p>
            ${alert.metadata ? `
              <h3>Details:</h3>
              <pre>${JSON.stringify(alert.metadata, null, 2)}</pre>
            ` : ''}
            <hr>
            <small>Sent at ${new Date().toISOString()}</small>
          `,
        }),
      });

      if (!response.ok) {
        throw new Error(`Resend API error: ${response.status}`);
      }

      console.log('✅ Email alert sent successfully');
    } catch (error) {
      console.error('❌ Failed to send email alert:', error);
    }
  }

  /**
   * Envoie une alerte sur Slack
   * Nécessite: SLACK_WEBHOOK_URL dans .env
   */
  private async sendSlack(alert: Alert): Promise<void> {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('⚠️  Slack alerts not configured (missing SLACK_WEBHOOK_URL)');
      return;
    }

    const emoji = {
      info: ':information_source:',
      warning: ':warning:',
      critical: ':rotating_light:',
    }[alert.level];

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `${emoji} *${alert.title}*`,
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: `${alert.title}`,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: alert.message,
              },
            },
            ...(alert.metadata ? [{
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `\`\`\`${JSON.stringify(alert.metadata, null, 2)}\`\`\``,
              },
            }] : []),
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Slack webhook error: ${response.status}`);
      }

      console.log('✅ Slack alert sent successfully');
    } catch (error) {
      console.error('❌ Failed to send Slack alert:', error);
    }
  }

  /**
   * Envoie une alerte sur Discord
   * Nécessite: DISCORD_WEBHOOK_URL dans .env
   */
  private async sendDiscord(alert: Alert): Promise<void> {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('⚠️  Discord alerts not configured (missing DISCORD_WEBHOOK_URL)');
      return;
    }

    const color = {
      info: 0x3498db,    // Blue
      warning: 0xf39c12, // Orange
      critical: 0xe74c3c, // Red
    }[alert.level];

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: alert.title,
            description: alert.message,
            color,
            fields: alert.metadata ? Object.entries(alert.metadata).map(([key, value]) => ({
              name: key,
              value: String(value),
              inline: true,
            })) : [],
            timestamp: new Date().toISOString(),
          }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Discord webhook error: ${response.status}`);
      }

      console.log('✅ Discord alert sent successfully');
    } catch (error) {
      console.error('❌ Failed to send Discord alert:', error);
    }
  }

  /**
   * Envoie une alerte (dispatch vers tous les canaux configurés)
   */
  async send(alert: Alert): Promise<void> {
    // Toujours logger dans la console
    this.logToConsole(alert);

    // Envoyer uniquement si le niveau est warning ou critical
    if (alert.level === 'info') {
      return;
    }

    // Envoyer en parallèle vers tous les canaux configurés
    await Promise.allSettled([
      this.sendEmail(alert),
      this.sendSlack(alert),
      this.sendDiscord(alert),
    ]);
  }

  /**
   * Helper pour créer une alerte de rate limiting
   */
  rateLimitAlert(ip: string, blockCount: number): Alert {
    return {
      level: blockCount >= 10 ? 'critical' : 'warning',
      title: 'Suspicious Rate Limit Activity',
      message: `IP address has been rate limited ${blockCount} times today`,
      metadata: {
        ip,
        blockCount,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Helper pour créer une alerte de tentative d'accès non autorisé
   */
  unauthorizedAccessAlert(ip: string, reason: string): Alert {
    return {
      level: 'warning',
      title: 'Unauthorized Access Attempt',
      message: `Blocked request from suspicious origin`,
      metadata: {
        ip,
        reason,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Helper pour créer une alerte de prompt injection
   */
  promptInjectionAlert(ip: string, pattern: string): Alert {
    return {
      level: 'critical',
      title: 'Potential Prompt Injection Detected',
      message: `Suspicious content pattern detected in anonymous request`,
      metadata: {
        ip,
        pattern,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Helper pour créer une alerte d'échec de paiement Stripe
   */
  paymentFailedAlert(organizationId: string, invoiceId: string, amount?: number): Alert {
    return {
      level: 'warning',
      title: 'Payment Failed',
      message: `A subscription payment has failed. The organization's subscription will be cancelled at period end unless payment is updated.`,
      metadata: {
        organizationId,
        invoiceId,
        amount,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Helper pour créer une alerte d'erreur webhook Stripe
   */
  stripeWebhookErrorAlert(eventType: string, error: string): Alert {
    return {
      level: 'critical',
      title: 'Stripe Webhook Error',
      message: `Failed to process Stripe webhook event: ${eventType}`,
      metadata: {
        eventType,
        error,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Helper pour créer une alerte d'erreur webhook Clerk
   */
  clerkWebhookErrorAlert(eventType: string, error: string): Alert {
    return {
      level: 'critical',
      title: 'Clerk Webhook Error',
      message: `Failed to process Clerk webhook event: ${eventType}`,
      metadata: {
        eventType,
        error,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Helper pour créer une alerte de souscription annulée
   */
  subscriptionCancelledAlert(organizationId: string, organizationName?: string): Alert {
    return {
      level: 'info',
      title: 'Subscription Cancelled',
      message: `An organization has cancelled their subscription.`,
      metadata: {
        organizationId,
        organizationName,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Helper pour créer une alerte d'erreur cron job
   */
  cronJobErrorAlert(jobName: string, error: string): Alert {
    return {
      level: 'critical',
      title: 'Cron Job Failed',
      message: `The scheduled job "${jobName}" has failed.`,
      metadata: {
        jobName,
        error,
        timestamp: new Date().toISOString(),
      },
    };
  }
}

// Export singleton instance
export const alertSystem = new AlertSystem();
