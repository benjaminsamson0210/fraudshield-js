# 🛡️ FraudShield Client SDK (JavaScript / TypeScript)

Official client SDK for **FraudShield**, the ultra-low-latency enterprise email fraud detection, disposable/burner email checker, and DNS MX resolution API available on the [RapidAPI Marketplace](https://rapidapi.com).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)](https://www.typescriptlang.org)
[![RapidAPI](https://img.shields.io/badge/RapidAPI-Verified-success)](https://rapidapi.com)

---

## ⚡ What is FraudShield?

FraudShield protects SaaS signups, marketing funnels, and e-commerce checkouts by detecting:
* **Disposable & Temporary Burner Emails:** Instant lookup against thousands of active burner domains (10minutemail, GuerrillaMail, Mailinator, Temp-Mail, etc.).
* **Live Edge DNS-over-HTTPS (DoH) MX Checks:** Verifies mail exchange server existence in real-time via Cloudflare & Google DNS without UDP socket latency.
* **Typo & Typosquatting Traps:** Automatically catches misspelled domains (e.g. `gmial.com`, `hotmial.com`) and suggests corrections.
* **Role & Disposable Inboxes:** Flags shared inboxes (`billing@`, `support@`, `admin@`).
* **Weighted Fraud Risk Score (0–100):** Clear deliverability verdicts: `deliverable`, `risky`, `undeliverable`, or `disposable`.

---

## 🔑 Getting Your API Key

1. Go to the [FraudShield API on RapidAPI](https://rapidapi.com).
2. Click **Subscribe to Test** (free tier includes 100 requests/month).
3. Copy your `X-RapidAPI-Key`.

---

## 📦 Installation

```bash
npm install fraudshield-client
```

---

## 🚀 Quickstart

### 1. Verify a Single Email

```typescript
import { FraudShield } from 'fraudshield-client';

const client = new FraudShield({
  apiKey: 'YOUR_RAPIDAPI_KEY'
});

async function main() {
  const result = await client.verify('user@mailinator.com');

  console.log('Verdict:', result.verdict);       // 'disposable'
  console.log('Risk Score:', result.risk_score);  // 90
  console.log('Is Disposable:', result.is_disposable); // true
  console.log('Flags:', result.flags);           // ['DISPOSABLE_EMAIL_DOMAIN']
}

main();
```

### 2. Batch Verification (Up to 50 Emails Concurrently)

```typescript
const batchResult = await client.batchVerify([
  'user1@gmail.com',
  'spammer@10minutemail.com',
  'billing@stripe.com'
]);

console.log(`Verified ${batchResult.total} emails in ${batchResult.total_latency_ms}ms`);
```

---

## 📋 Response Schema

```json
{
  "email": "user@mailinator.com",
  "user": "user",
  "domain": "mailinator.com",
  "verdict": "disposable",
  "risk_score": 90,
  "is_valid_format": true,
  "is_disposable": true,
  "is_free_email": false,
  "is_role_account": false,
  "has_mx_records": true,
  "mx_records": ["mail.mailinator.com"],
  "is_typo": false,
  "suggested_domain": null,
  "flags": ["DISPOSABLE_EMAIL_DOMAIN"],
  "latency_ms": 11.4
}
```

---

## 🌐 cURL Example

```bash
curl --request GET \
	--url 'https://fraud-shield-api.fraud-shield-api.workers.dev/v1/verify?email=test%40mailinator.com&check_mx=true' \
	--header 'x-rapidapi-host: fraud-shield-api.p.rapidapi.com' \
	--header 'x-rapidapi-key: YOUR_RAPIDAPI_KEY'
```

---

## 📄 License
MIT License. Free for commercial and private use.
