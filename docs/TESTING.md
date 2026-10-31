# Envello — Quality Assurance & Testing Strategy

## 1. Testing Philosophy

Because Envello manages real personal financial records, testing is not an afterthought — it is the primary guarantee of mathematical correctness and data privacy. Every accounting calculation, RLS policy, and balance state must be verifiable through automated tests or rigorous verification procedures.

---

## 2. Test Pyramid & Tooling

```text
       ▲
      / \        E2E & Smoke Verification (Manual + Browser Automation)
     /   \       ----------------------------------------------------
    /     \      Integration & RLS Policy Verification (Supabase Cloud / Local SQL)
   /       \     -----------------------------------------------------------
  /_________\    Unit Tests: Invariants, Auth & Security Suites (Vitest, 53 Suites)
```

- **Unit Testing**: Vitest for fast, pure TypeScript unit testing of `src/lib/accounting/`, `src/lib/security/`, and `src/lib/validation/`.
- **Database & RLS Testing**: Database migration scripts enforce constraints, foreign keys, and RLS policies asserting `auth.uid() = user_id`.
- **Static Analysis**: TypeScript strict type checking (`tsc -b`) and ESLint.

---

## 3. Automated Test Suites (53/53 Passing)

The automated test suite runs via `npm test` and covers the following critical domains:

### 3.1 Accounting Invariant Test Suite (`src/lib/accounting/invariants.test.ts`)
- **Paise Precision**: `toPaise(0.1) + toPaise(0.2) === toPaise(0.3)` with zero IEEE 754 float drift.
- **Transfer Conservation**: Transfers between accounts debit and credit identical paise amounts without altering overall spendable net worth or registering false expenses.
- **Credit Card Billing**: Card purchases increase liabilities and deduct from envelopes while leaving spendable bank cash untouched until statement settlement.
- **Card Utilization Health**: Utilization percentages calculate deterministically:
  - `< 30%`: Safe (Comfortable).
  - `30% - 50%`: Caution (Moderate).
  - `> 50%`: High Risk (Warning alert).
- **Self-EMIs vs Actual Debts**:
  - Self-EMI: Internal borrowing from savings; repayments replenish locked savings without being counted as expenses.
  - Actual Debt: Repaying third-party loans reduces outstanding debt balances.
- **Emergency Reserve Protection**: Dedicated emergency reserves require explicit confirmation and cannot be silently drained by other envelope deficits.

### 3.2 Envelope Allocation Undo Engine (`src/lib/accounting/envelopeUndo.test.ts`)
- **Snapshot Capture**: Captures atomic state before multi-envelope budgeting reallocations.
- **1-Click Rollback**: Restores exact prior balances upon user undo action.
- **Stack Integrity**: Prevents corrupted balance states during rapid successive allocations.

### 3.3 Security Sanitization Suite (`src/lib/security/sanitization.test.ts`)
- **Anti-XSS**: Strips `<script>`, `<iframe>`, `javascript:`, and dangerous HTML tags from payee names, notes, and labels.
- **Safe URI Enforcement**: Rejects malicious redirect schemes (`data:`, `vbscript:`).
- **HTML Entity Encoding**: Correctly escapes special characters (`&`, `<`, `>`, `"`, `'`).

### 3.4 Rate Limiter & Cooldown Engine (`src/lib/security/rateLimiter.test.ts`)
- **Brute-Force Defense**: Tracks failed attempts per client key.
- **Exponential Backoff**: Enforces exponential cooldown periods once thresholds are exceeded.
- **Window Eviction**: Cleans up stale rate-limiting timestamps after the expiration window.

### 3.5 File Upload Validation (`src/lib/security/fileUpload.test.ts`)
- **MIME Type Whitelisting**: Rejects non-JSON / executable file formats during data import.
- **Payload Size Clamping**: Restricts import payloads to prevent memory exhaustion and DoS.

### 3.6 Schema Boundaries (`src/lib/validation/schemas.test.ts`)
- **String Length Limits**: Enforces bounds on account names, descriptions, and category labels matching database constraints.
- **Type Coercion & Integrity**: Validates numeric paise BigInt bounds and prevents NaN injections.

---

## 4. Row Level Security (RLS) Verification

Before any database migration is merged:
1. **Unauthenticated Access**: Anonymous queries return `401 Unauthorized` or empty arrays.
2. **Cross-User Data Isolation**: User B cannot view, edit, or delete accounts, envelopes, or transactions created by User A.
3. **Owner Identity Verification**: PostgreSQL RPC functions assert `auth.uid() = target_id`.

---

## 5. Pre-Release Verification Checklist

Run through this checklist prior to any production deployment:
- [ ] `npm run lint` passes with 0 errors (`tsc -b`).
- [ ] `npm run test` passes with 53/53 tests successful.
- [ ] `npm run build` succeeds cleanly in under 10 seconds.
- [ ] Visual inspection confirms zero horizontal scrolling across desktop, tablet, and mobile.
- [ ] Form inputs meet 16px mobile scale to prevent iOS Safari auto-zoom.
- [ ] Interactive touch targets meet the 44px minimum height requirement.
