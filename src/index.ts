export interface FraudShieldOptions {
  apiKey: string;
  apiHost?: string;
  baseUrl?: string;
}

export type Verdict = 'deliverable' | 'risky' | 'undeliverable' | 'disposable';

export interface EmailVerificationResult {
  email: string;
  user: string;
  domain: string;
  verdict: Verdict;
  risk_score: number;
  is_valid_format: boolean;
  is_disposable: boolean;
  is_free_email: boolean;
  is_role_account: boolean;
  has_mx_records: boolean | null;
  mx_records?: string[];
  is_typo: boolean;
  suggested_domain?: string;
  flags: string[];
  processed_at: string;
  latency_ms: number;
}

export interface BatchVerificationResponse {
  total: number;
  results: EmailVerificationResult[];
  processed_at: string;
  total_latency_ms: number;
}

export class FraudShield {
  private apiKey: string;
  private apiHost: string;
  private baseUrl: string;

  constructor(options: FraudShieldOptions) {
    if (!options.apiKey) {
      throw new Error('FraudShield: apiKey is required to initialize client');
    }
    this.apiKey = options.apiKey;
    this.apiHost = options.apiHost || 'fraud-shield-api.p.rapidapi.com';
    this.baseUrl = options.baseUrl || 'https://fraud-shield-api.fraud-shield-api.workers.dev';
  }

  /**
   * Verifies a single email address for disposable provider status, typos, and fraud risk.
   */
  async verify(email: string, checkMx: boolean = true): Promise<EmailVerificationResult> {
    const url = new URL(`${this.baseUrl}/v1/verify`);
    url.searchParams.set('email', email);
    if (!checkMx) {
      url.searchParams.set('check_mx', 'false');
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-rapidapi-key': this.apiKey,
        'x-rapidapi-host': this.apiHost,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`FraudShield API Error (${response.status}): ${errorText}`);
    }

    return (await response.json()) as EmailVerificationResult;
  }

  /**
   * Concurrently verifies up to 50 email addresses in a single request.
   */
  async batchVerify(emails: string[], checkMx: boolean = true): Promise<BatchVerificationResponse> {
    const url = `${this.baseUrl}/v1/batch-verify`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-rapidapi-key': this.apiKey,
        'x-rapidapi-host': this.apiHost,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ emails, check_mx: checkMx })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`FraudShield Batch Error (${response.status}): ${errorText}`);
    }

    return (await response.json()) as BatchVerificationResponse;
  }
}
