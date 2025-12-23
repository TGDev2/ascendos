import { describe, it, expect } from "vitest";
import { redactSensitiveInfo, containsSensitiveInfo, redactUpdate, redactDecision, redactRisk } from "./redaction";

describe("redactSensitiveInfo", () => {
  describe("email addresses", () => {
    it("should redact standard email addresses", () => {
      const input = "Contact: john.doe@example.com for more info";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("Contact: [EMAIL_REDACTED] for more info");
    });

    it("should redact multiple email addresses", () => {
      const input = "Send to alice@test.com and bob@company.org";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("Send to [EMAIL_REDACTED] and [EMAIL_REDACTED]");
    });

    it("should redact mailto links", () => {
      const input = "Click mailto:support@example.com for help";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("Click mailto:[EMAIL_REDACTED] for help");
    });
  });

  describe("phone numbers", () => {
    it("should redact French phone numbers (spaced)", () => {
      const input = "Appelez le 01 23 45 67 89";
      const result = redactSensitiveInfo(input);
      expect(result).toContain("[PHONE_REDACTED]");
    });

    it("should redact international phone numbers", () => {
      const input = "Call +33 1 23 45 67 89";
      const result = redactSensitiveInfo(input);
      expect(result).toContain("[PHONE_REDACTED]");
    });

    it("should redact US phone numbers", () => {
      const input = "Call (555) 123-4567";
      const result = redactSensitiveInfo(input);
      expect(result).toContain("[PHONE_REDACTED]");
    });
  });

  describe("French SSN (NIR)", () => {
    it("should redact French SSN with spaces", () => {
      const input = "NIR: 1 85 12 75 108 042 36";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("NIR: [SSN_REDACTED]");
    });

    it("should redact French SSN without spaces", () => {
      const input = "NIR: 185127510804236";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("NIR: [SSN_REDACTED]");
    });
  });

  describe("IBAN", () => {
    it("should redact French IBAN", () => {
      const input = "IBAN: FR76 1234 5678 9012 3456 7890 123";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("IBAN: [IBAN_REDACTED]");
    });
  });

  describe("credit cards", () => {
    it("should redact Visa card numbers", () => {
      const input = "Card: 4111111111111111";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("Card: [CARD_REDACTED]");
    });

    it("should redact card numbers with spaces", () => {
      const input = "Card: 4111 1111 1111 1111";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("Card: [CARD_REDACTED]");
    });
  });

  describe("IP addresses", () => {
    it("should redact IPv4 addresses", () => {
      const input = "Request from 192.168.1.100";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("Request from [IP_REDACTED]");
    });
  });

  describe("names with titles", () => {
    it("should redact French names with M.", () => {
      const input = "Signé par M. Dupont";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("Signé par M. [NAME_REDACTED]");
    });

    it("should redact French names with Mme", () => {
      const input = "Contact: Mme Martin";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("Contact: Mme [NAME_REDACTED]");
    });

    it("should redact English names with Dr.", () => {
      const input = "Dr. Smith approved";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("Dr. [NAME_REDACTED] approved");
    });

    it("should redact full names with titles", () => {
      const input = "M. Jean Dupont";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("M. [NAME_REDACTED]");
    });
  });

  describe("French patterns", () => {
    it("should redact 'de la part de' pattern", () => {
      const input = "de la part de Marie Curie";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("de la part de [NAME_REDACTED]");
    });

    it("should redact 'signé' pattern", () => {
      const input = "signé Pierre Durand";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("signé [NAME_REDACTED]");
    });
  });

  describe("URLs with sensitive parameters", () => {
    it("should redact token parameters", () => {
      const input = "https://example.com?token=abc123secret";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("https://example.com?token=[REDACTED]");
    });

    it("should redact api_key parameters", () => {
      const input = "https://api.example.com?api_key=sk-123abc";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("https://api.example.com?api_key=[REDACTED]");
    });
  });

  describe("Bearer tokens", () => {
    it("should redact JWT Bearer tokens", () => {
      const input = "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("Authorization: Bearer [TOKEN_REDACTED]");
    });
  });

  describe("API keys", () => {
    it("should redact sk-* API keys", () => {
      const input = "Key: sk-1234567890abcdefghij1234567890";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("Key: [API_KEY_REDACTED]");
    });

    it("should redact pk_* API keys", () => {
      const input = "Key: pk_1234567890abcdefghij1234567890";
      const result = redactSensitiveInfo(input);
      expect(result).toBe("Key: [API_KEY_REDACTED]");
    });
  });
});

describe("containsSensitiveInfo", () => {
  it("should detect email addresses", () => {
    expect(containsSensitiveInfo("test@example.com")).toBe(true);
  });

  it("should detect phone numbers", () => {
    expect(containsSensitiveInfo("01 23 45 67 89")).toBe(true);
  });

  it("should detect names with titles", () => {
    expect(containsSensitiveInfo("M. Dupont")).toBe(true);
  });

  it("should return false for clean text", () => {
    expect(containsSensitiveInfo("This is a clean text about projects")).toBe(false);
  });
});

describe("redactUpdate", () => {
  it("should redact all sensitive fields", () => {
    const update = {
      emailSubject: "Update from M. Dupont",
      emailBody: "Contact: john@example.com",
      slackMessage: "Call 01 23 45 67 89",
      rawInput: "signé Pierre Martin",
    };

    const result = redactUpdate(update);

    expect(result.emailSubject).toBe("Update from M. [NAME_REDACTED]");
    expect(result.emailBody).toBe("Contact: [EMAIL_REDACTED]");
    expect(result.slackMessage).toContain("[PHONE_REDACTED]");
    expect(result.rawInput).toBe("signé [NAME_REDACTED]");
  });

  it("should handle undefined fields", () => {
    const update = {
      emailSubject: "Test",
    };

    const result = redactUpdate(update);

    expect(result.emailSubject).toBe("Test");
    expect(result.emailBody).toBeUndefined();
    expect(result.slackMessage).toBeUndefined();
    expect(result.rawInput).toBeUndefined();
  });
});

describe("redactDecision", () => {
  it("should redact decision fields", () => {
    const decision = {
      description: "Approved by M. Dupont",
      context: "Email from john@example.com",
      outcome: "Contact: 01 23 45 67 89",
      decidedBy: "Mme Martin",
    };

    const result = redactDecision(decision);

    expect(result.description).toBe("Approved by M. [NAME_REDACTED]");
    expect(result.context).toBe("Email from [EMAIL_REDACTED]");
    expect(result.outcome).toContain("[PHONE_REDACTED]");
    expect(result.decidedBy).toBe("Mme [NAME_REDACTED]");
  });
});

describe("redactRisk", () => {
  it("should redact risk fields", () => {
    const risk = {
      description: "Risk reported by M. Dupont",
      impact: "Contact john@example.com for escalation",
      mitigation: "Call 01 23 45 67 89 if critical",
    };

    const result = redactRisk(risk);

    expect(result.description).toBe("Risk reported by M. [NAME_REDACTED]");
    expect(result.impact).toBe("Contact [EMAIL_REDACTED] for escalation");
    expect(result.mitigation).toContain("[PHONE_REDACTED]");
  });
});
