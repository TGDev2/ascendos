/**
 * Redaction utilities for GDPR compliance
 * Masks sensitive information (emails, phones, names, IDs) in text
 *
 * Patterns covered:
 * - Email addresses
 * - Phone numbers (international and national formats)
 * - Names with titles (M., Mme, Mr, Mrs, Dr, etc.)
 * - French social security numbers (NIR)
 * - IBANs (International Bank Account Numbers)
 * - Credit card numbers
 * - IP addresses
 * - URLs with sensitive query parameters
 */

/**
 * Redact sensitive information from text
 * Comprehensive PII detection and masking
 */
export function redactSensitiveInfo(text: string): string {
  let redacted = text;

  // 1. Email addresses (standard format)
  redacted = redacted.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    "[EMAIL_REDACTED]"
  );

  // 2. mailto: links
  redacted = redacted.replace(
    /mailto:[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/gi,
    "mailto:[EMAIL_REDACTED]"
  );

  // 3. Phone numbers (comprehensive patterns)
  // International: +33 1 23 45 67 89, +33123456789, +1 555 123 4567
  // French: 01 23 45 67 89, 0123456789, 01-23-45-67-89, 01.23.45.67.89
  // US: (555) 123-4567, 555-123-4567, 555.123.4567
  redacted = redacted.replace(
    /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}[-.\s]?\d{2,4}/g,
    "[PHONE_REDACTED]"
  );

  // 4. French Social Security Number (NIR) - 13 or 15 digits
  // Format: 1 85 12 75 108 042 36 or 185127510804236
  redacted = redacted.replace(
    /\b[12]\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{3}\s?\d{3}\s?\d{2}\b/g,
    "[SSN_REDACTED]"
  );

  // 5. IBAN (International Bank Account Number)
  // Format: FR76 1234 5678 9012 3456 7890 123 or continuous
  redacted = redacted.replace(
    /\b[A-Z]{2}\d{2}[\s]?([A-Z0-9]{4}[\s]?){3,7}[A-Z0-9]{1,4}\b/gi,
    "[IBAN_REDACTED]"
  );

  // 6. Credit card numbers (13-19 digits, with or without spaces/dashes)
  // Visa, Mastercard, Amex patterns
  redacted = redacted.replace(
    /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
    "[CARD_REDACTED]"
  );
  // With spaces or dashes
  redacted = redacted.replace(
    /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
    "[CARD_REDACTED]"
  );

  // 7. IP addresses (v4)
  redacted = redacted.replace(
    /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    "[IP_REDACTED]"
  );

  // 8. Names with titles (French and English)
  // M., Mme, Mlle, Mr, Mrs, Ms, Miss, Dr, Prof, Pr, Me (Maître)
  redacted = redacted.replace(
    /\b(M\.|Mme|Mlle|Mr\.?|Mrs\.?|Ms\.?|Miss|Dr\.?|Prof\.?|Pr\.?|Me)\s+[A-ZÀ-Ü][a-zà-ü]+(\s+[A-ZÀ-Ü][a-zà-ü-]+)?\b/g,
    (match) => {
      const title = match.match(/^(M\.|Mme|Mlle|Mr\.?|Mrs\.?|Ms\.?|Miss|Dr\.?|Prof\.?|Pr\.?|Me)/)?.[0];
      return title ? `${title} [NAME_REDACTED]` : "[NAME_REDACTED]";
    }
  );

  // 9. Names following common French patterns
  // "de la part de X", "signé X", "contact: X", "responsable: X"
  redacted = redacted.replace(
    /\b(de la part de|signé|contact\s*:?|responsable\s*:?|envoyé par|rédigé par)\s+[A-ZÀ-Ü][a-zà-ü]+(\s+[A-ZÀ-Ü][a-zà-ü-]+)?\b/gi,
    "$1 [NAME_REDACTED]"
  );

  // 10. URLs with sensitive query parameters
  // token, key, secret, password, auth, api_key, access_token
  redacted = redacted.replace(
    /([?&])(token|key|secret|password|auth|api_key|access_token|session|sid)=([^&\s]+)/gi,
    "$1$2=[REDACTED]"
  );

  // 11. Bearer tokens in text
  redacted = redacted.replace(
    /Bearer\s+[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+/gi,
    "Bearer [TOKEN_REDACTED]"
  );

  // 12. API keys (common patterns)
  // sk-xxx, pk_xxx, api_xxx formats
  redacted = redacted.replace(
    /\b(sk|pk|api)[_-][a-zA-Z0-9]{20,}\b/g,
    "[API_KEY_REDACTED]"
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
