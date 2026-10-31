# Security Policy

## 🔒 Supported Versions

We actively maintain and provide security patches for the following versions of **Envello**:

| Version | Status | Security Support |
| :--- | :--- | :--- |
| `0.1.x` (Current) | Active Production | :white_check_mark: Full Support |
| `< 0.1.0` | Deprecated Beta | :x: End of Life |

---

## 🛡️ Security Architecture & Invariants

Envello is built on the principle that financial confidentiality and accounting integrity are paramount. Our security model includes:

### 1. Row Level Security (RLS) on 100% of Tables
- Every PostgreSQL table enforces Row Level Security with strict least-privilege policies.
- Users can never query, insert, modify, or delete financial records belonging to any other user.

### 2. Zero-Trust Client User IDs & Caller Identity Assertions
- Ownership is strictly derived from `auth.uid()` directly inside PostgreSQL policies and `SECURITY DEFINER` functions.
- All stored procedures explicitly verify caller identity:
  ```sql
  IF target_user_id IS NULL OR (target_user_id != auth.uid() AND auth.role() != 'service_role') THEN
    RAISE EXCEPTION 'Unauthorized: Caller identity does not match target account';
  END IF;
  ```
- Public and anonymous execution privileges are revoked by default across sensitive functions.

### 3. Client Secret Isolation
- Supabase `service_role` keys and database administrator credentials are never shipped to client code or committed to version control.
- Vite build configurations restrict client environment exposure strictly to `VITE_*` variables, verified by automated build scans.

### 4. Robust Auth, PKCE & Rate Limiting
- OAuth exchanges mandate PKCE flow (`flowType: 'pkce'`).
- Local client-side rate limiters defend sensitive authentication forms against brute-force attacks with exponential backoff cooldowns.
- Password policies require a minimum of 8 characters with mixed uppercase, lowercase, and numeric complexity.

### 5. Input Boundary Sanitization & Anti-XSS
- All user-supplied descriptions, notes, and strings are validated through strict Zod schemas with character length bounds to prevent resource exhaustion.
- Anti-XSS sanitization strips dangerous HTML tags and prevents script injection across all transaction entries and envelope labels.

### 6. User Data Sovereignty & 30-Day Closure Lifecycle
- **Complete Portability**: 1-click JSON ledger export at any time.
- **30-Day Grace Period**: Scheduled account closure grants a 30-day window with 1-click restoration upon signing in.
- **Immediate Data Wipe**: An optional instant wipe path executes a cascading permanent purge upon explicit typed email verification.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or suspect an authorization bypass in Envello, please do **NOT** open a public GitHub issue.

Please disclose findings responsibly by contacting the maintainer directly:

- **Security Lead**: Jayesh Yadav
- **Email**: [yadavjayesh2008@gmail.com](mailto:yadavjayesh2008@gmail.com)
- **Subject**: `[SECURITY VULNERABILITY] Envello - <Brief Summary>`
- **Response Timeline**: 
  - **Acknowledgment**: Within 48 hours.
  - **Triage & Assessment**: Within 72 hours.
  - **Patch Release & Advisory**: Within 7 days.

### What to Include in Your Report
To facilitate fast triage and reproduction:
1. Clear description of the vulnerability and its potential impact.
2. Step-by-step reproduction instructions or a minimal proof-of-concept.
3. Affected components, database tables, or endpoints.
4. Any proposed fix or remediation (if available).

We are deeply grateful to researchers who help keep personal financial data safe through responsible disclosure.
