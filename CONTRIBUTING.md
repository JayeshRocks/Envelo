# Contributing to Envello

Thank you for your interest in contributing to **Envello**! 

Envello is a deterministic personal finance ledger and envelope-budgeting application designed for mathematical correctness, strict privacy boundaries, and a ₹0/month operating cost.

To protect personal financial records and maintain user trust, all code contributions must adhere to the engineering invariants detailed below.

---

## 🏛️ Non-Negotiable Engineering Invariants

### 1. Absolute Accounting Correctness (Zero Floating-Point Math)
- **Integer Paise Only**: Every monetary value is stored and calculated in integer **paise** (`₹1.00 = 100 paise`) or PostgreSQL `NUMERIC(12, 2)`.
- **Never use standard JavaScript IEEE 754 floats** (`0.1 + 0.2 === 0.30000000000000004`) for balance additions, subtractions, or ledger reconciliations without a fixed-point helper.
- **Database is Authoritative**: UI components must never compute ad-hoc balances that contradict or bypass persisted transactions.

### 2. Six-Pillar Balance Taxonomy
Never collapse balances into an ambiguous single number labeled "Total Balance". Always explicitly separate:
1. **Spendable Cash** (liquid checking/savings/cash)
2. **Envelope Allocations** (budgeted money for current month spending)
3. **Savings & Fixed Deposits** (locked long-term assets)
4. **Credit Card Liabilities** (unsettled debt owed to card issuers)
5. **Actual Debts** (debts owed to friends, family, or lenders)
6. **Monthly Targets** (planning goals, not liquid balances)

### 3. Strict Row Level Security (RLS) & Least Privilege
- Every PostgreSQL table, view, and bucket must have RLS enabled with explicit least-privilege policies.
- Never trust `user_id` or `auth.uid()` passed in client request bodies. All ownership checks must resolve strictly against `auth.uid()` directly in database policies.
- Revoke public execution on `SECURITY DEFINER` functions and assert caller identity (`auth.uid() = target_id`).

### 4. Zero Secrets in Client Bundles
- Never commit `.env` or reference Supabase `service_role` keys or database credentials in client code.
- Variables prefixed with `VITE_*` are publicly exposed in the browser bundle.

### 5. Mobile & Tablet Ergonomics
- All form inputs, selects, and textareas must use `text-base sm:text-sm` (16px on mobile to prevent iOS Safari auto-zoom).
- Interactive buttons and dropdown items must maintain at least a 44px minimum touch target (`min-h-[44px]`).
- Modals must be rendered via `ModalPortal` (`createPortal(..., document.body)`) to escape parent clipping and center properly across all devices.
- Zero horizontal scrolling: buttons, tabs, and filters must use responsive wrapping layouts or fixed-width tables.

### 6. Zero-Cost Operating Architecture
- Envello runs on free tiers (Vercel Hobby, Supabase Free tier, Resend SMTP).
- Never introduce paid third-party APIs, proprietary libraries, or recurring subscription services.

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **npm**: `v10.x` or higher
- **Git**

### 2. Initial Setup
```bash
# Clone the repository
git clone https://github.com/JayeshRocks/Envello.git
cd Envello

# Install clean dependencies
npm install

# Setup environment configuration
cp .env.example .env

# Start local Vite development server
npm run dev
```

### 3. Branching & Commit Conventions
- Create descriptive feature branches from `main`:
  ```bash
  git checkout -b feat/envelope-carryover-rules
  ```
- Use [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat(envelopes)`: Add new rollover policy option
  - `fix(ledger)`: Correct transfer credit rounding
  - `docs(readme)`: Update architecture flow diagrams
  - `test(security)`: Add rate-limiter backoff test case
  - `style(ui)`: Refine high-contrast button styling

---

## ✅ Quality Gate (Definition of Done)

Before opening any Pull Request, you **MUST** ensure all automated checks pass locally:

```bash
# 1. Typecheck and linting
npm run lint

# 2. Accounting invariant & security test suites (53 tests)
npm run test

# 3. Production bundle build verification
npm run build
```

---

## 📬 Submitting a Pull Request

1. Push your branch to GitHub.
2. Open a Pull Request targeting `main`.
3. Complete the PR template checklist:
   - Provide a clear summary of changes.
   - Confirm that no floating-point arithmetic was introduced.
   - Verify that any database changes include corresponding RLS policies and SQL migrations in `supabase/migrations/`.
   - Confirm all local tests pass.
