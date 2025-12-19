/**
 * Redaction utilities for GDPR compliance
 * Masks sensitive information (emails, phones, names) in text
 */

/**
 * Redact sensitive information from text
 * Masks emails, phone numbers, and potential personal names
 */
export function redactSensitiveInfo(text: string): string {
  let redacted = text;

  // Redact email addresses
  redacted = redacted.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    "[EMAIL_REDACTED]"
  );

  // Redact phone numbers (various formats)
  // International: +33 1 23 45 67 89, +33123456789
  // National: 01 23 45 67 89, 0123456789, 01-23-45-67-89
  // US: (555) 123-4567, 555-123-4567, 555.123.4567
  redacted = redacted.replace(
    /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}[-.\s]?\d{2,4}/g,
    "[PHONE_REDACTED]"
  );

  // Redact potential names (capitalized words, common patterns)
  // This is a basic heuristic - matches "M. Name", "Mme Name", "Mr Name", etc.
  redacted = redacted.replace(
    /\b(M\.|Mme|Mr|Mrs|Ms|Dr|Prof)\.?\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?\b/g,
    (match) => {
      const title = match.match(/^(M\.|Mme|Mr|Mrs|Ms|Dr|Prof)\.?/)?.[0];
      return title ? `${title} [NAME_REDACTED]` : "[NAME_REDACTED]";
    }
  );

  // Redact email-like patterns in URLs
  redacted = redacted.replace(
    /mailto:[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/gi,
    "mailto:[EMAIL_REDACTED]"
  );

  return redacted;
}

/**
 * Check if a text contains sensitive information
 * Useful for detecting if redaction is needed
 */
export function containsSensitiveInfo(text: string): boolean {
  // Check for emails
  if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) {
    return true;
  }

  // Check for phone numbers
  if (/(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}[-.\s]?\d{2,4}/.test(text)) {
    return true;
  }

  // Check for titles followed by names
  if (/\b(M\.|Mme|Mr|Mrs|Ms|Dr|Prof)\.?\s+[A-Z][a-z]+/.test(text)) {
    return true;
  }

  return false;
}

/**
 * Redact specific fields in an update object
 * Used when auto-redaction is enabled
 */
export function redactUpdate(update: {
  emailSubject?: string;
  emailBody?: string;
  slackMessage?: string;
  rawInput?: string | null;
}): typeof update {
  return {
    ...update,
    emailSubject: update.emailSubject ? redactSensitiveInfo(update.emailSubject) : undefined,
    emailBody: update.emailBody ? redactSensitiveInfo(update.emailBody) : undefined,
    slackMessage: update.slackMessage ? redactSensitiveInfo(update.slackMessage) : undefined,
    rawInput: update.rawInput ? redactSensitiveInfo(update.rawInput) : undefined,
  };
}

/**
 * Redact specific fields in a decision object
 */
export function redactDecision(decision: {
  description: string;
  context?: string | null;
  outcome?: string | null;
  decidedBy?: string | null;
}): typeof decision {
  return {
    ...decision,
    description: redactSensitiveInfo(decision.description),
    context: decision.context ? redactSensitiveInfo(decision.context) : decision.context,
    outcome: decision.outcome ? redactSensitiveInfo(decision.outcome) : decision.outcome,
    decidedBy: decision.decidedBy ? redactSensitiveInfo(decision.decidedBy) : decision.decidedBy,
  };
}

/**
 * Redact specific fields in a risk object
 */
export function redactRisk(risk: {
  description: string;
  impact: string;
  mitigation?: string | null;
}): typeof risk {
  return {
    ...risk,
    description: redactSensitiveInfo(risk.description),
    impact: redactSensitiveInfo(risk.impact),
    mitigation: risk.mitigation ? redactSensitiveInfo(risk.mitigation) : risk.mitigation,
  };
}
