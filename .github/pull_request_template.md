## 📝 Summary of Changes
Provide a clear, high-level summary of the motivation, changes, and user-facing impact of this Pull Request.

Fixes #(issue)

---

## 🏛️ Financial Math & Accounting Invariants
- [ ] **Integer Paise Arithmetic**: All financial calculations use integer paise (`₹1.00 = 100 paise`) or PostgreSQL `NUMERIC(12, 2)`. **Zero IEEE 754 floating-point additions or subtractions.**
- [ ] **Six-Pillar Taxonomy**: Preserves clear separation between liquid cash, envelope allocations, locked savings, card debt, counterparty debts, and targets.
- [ ] **Atomic Execution**: Multi-table state updates are executed atomically inside database transactions or secure PostgreSQL RPCs.
- [ ] **Conservation of Value**: Sum of all debits equals sum of all credits in transfers and allocations.

---

## 🔒 Security, RLS & Identity Invariants
- [ ] **Row Level Security (RLS)**: Enabled and verified with explicit least-privilege policies on all touched tables/views.
- [ ] **Zero Trust Client IDs**: Ownership is strictly derived from `auth.uid()` in database policies (no client `user_id` parameters trusted).
- [ ] **Secret Isolation**: No Supabase `service_role` keys, private tokens, or credentials exposed in frontend code or `VITE_*` env vars.
- [ ] **Anti-XSS & Validation**: Untrusted user inputs validated via Zod schemas and sanitized before rendering.

---

## 📱 Ergonomics & Mobile Design Standards
- [ ] **Typography Scale**: Form inputs, selects, and textareas use `text-base sm:text-sm` (16px on mobile to prevent iOS Safari auto-zoom).
- [ ] **Touch Targets**: 44px minimum touch targets (`min-h-[44px] min-w-[44px]`) on interactive buttons and controls.
- [ ] **Modal Portals**: Popups and modal dialogs are rendered via `ModalPortal` (`createPortal(..., document.body)`) to escape stacking and backdrop clipping.
- [ ] **Zero Horizontal Scrolling**: Tab strips, quick action pills, and tables use wrapping layouts or `table-fixed` layouts without forced horizontal scrolling.

---

## ✅ Quality Gate
- [ ] `npm run lint` (`tsc -b`) passes with 0 errors.
- [ ] `npm test` passes 100% of accounting invariant and security test suites.
- [ ] `npm run build` generates production bundle cleanly.
