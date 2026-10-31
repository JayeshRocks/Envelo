---
name: refero-styles
description: "Curated real-world design systems and AI-ingestible design token architecture (styles.refero.design / refero.design) extracted from premier software products (Linear, Stripe, Vercel, Raycast, Supabase) to build top-tier, deterministic interfaces without generic AI aesthetic."
---

# Refero Styles Skill

Structured design system intelligence, token specifications, and real-world software visual languages based on **Refero Styles** (`styles.refero.design`) and **Refero Design** (`refero.design`).

---

## 1. Overview & Philosophy

AI coding models often produce a generic, recognizable "AI look"—oversaturated purple gradients, fake glassmorphic blur with illegible contrast, inconsistent 12px fonts, and sloppy spacing.

**Refero Styles** counters this by distilling real-world design systems (Linear, Stripe, Vercel, Raycast, Supabase) into machine-readable design tokens, surface hierarchies, and spatial rules. When applied, AI agents output interfaces indistinguishable from top-tier design-engineering teams.

---

## 2. When to Use This Skill

Activate this skill when:
- Establishing or refining **design tokens**, color palettes, typography scales, and surface treatments.
- Designing high-density software: **data tables, financial dashboards, ledger views, and settings panels**.
- Choosing an aesthetic direction for a product (e.g. *Linear dark-mode precision*, *Vercel monochrome clarity*, or *Stripe financial transparency*).
- Eliminating visual bugs: low-contrast text, layout shifts, inconsistent border radii, or cramped mobile typography.
- Designing for keyboard-first power users with shortcut hints and micro-interactions.

---

## 3. Product Design Profiles

### 3.1 Linear Aesthetic (Precision & Dark Mode Mastery)
- **Palette**: Deep pitch black base (`#08090a`), secondary card surface (`#0f1011`), elevated panel (`#151618`).
- **Borders**: Razor-thin 1px outlines (`rgba(255, 255, 255, 0.08)`), increasing to `0.15` on hover.
- **Accents**: Desaturated, purposeful status colors—indigo/violet for primary actions (`#5e6ad2`), amber for warnings, emerald for completions.
- **Typography**: Inter or Geist, strict tracking (`tracking-tight`), `font-mono` for IDs, dates, and amounts.
- **Key Signatures**: Subtle top border glow highlights (`style={{ backgroundColor: color }}`), keyboard shortcuts (<kbd>⌘</kbd> + <kbd>K</kbd>), 100% visible wrapping controls.

### 3.2 Vercel Aesthetic (Monochrome Functionalism)
- **Palette**: Binary contrast—pure black (`#000000`), pure white (`#ffffff`), strict grayscale steps (`#111`, `#222`, `#444`, `#888`, `#eaeaea`).
- **Borders**: Sharp, high-contrast borders without heavy shadows (`border border-neutral-800`).
- **Typography**: Geist Sans + Geist Mono. Tabular numbers (`tabular-nums`), strict uppercase micro-labels (`text-[11px] uppercase tracking-wider`).
- **Key Signatures**: Geometric simplicity, zero superfluous decorative icons, clean segmented button strips, fast CSS transitions.

### 3.3 Stripe Aesthetic (Financial Rigor & Clarity)
- **Palette**: Clean slate darks (`#0f172a`, `#1e293b`) or crisp light surfaces. Distinct functional colors: slate blues, rich teals, clear alert roses.
- **Financial Taxonomy**: Zero ambiguity in numbers. Liquid cash is never mixed with credit limits or locked deposits.
- **Tables & Ledgers**: Alternating row highlights on hover, distinct date formatting, right-aligned monetary values with explicit currency symbols (`₹` or `$`).
- **Key Signatures**: Clear reconciliation markers, audit badges, high contrast table headers, multi-step confirmation modals with explicit impact warnings.

### 3.4 Raycast Aesthetic (Compact Keyboard Ergonomics)
- **Layout**: Centered command palettes, compact 36px-40px action rows, clear left icons and right-aligned shortcut badges.
- **Focus Rings**: High-contrast, glowing focus rings (`ring-2 ring-sky-500/50 ring-offset-2 ring-offset-black`).
- **Key Signatures**: Immediate keyboard shortcuts (<kbd>Ctrl</kbd> + <kbd>Z</kbd>, <kbd>Enter</kbd>, <kbd>Esc</kbd>), zero dead clicks, fast escape hatch dismissals.

---

## 4. Universal Design Token Architecture

```css
:root {
  /* Surface Elevation Scale (Dark Theme) */
  --surface-base: #0a0a0c;       /* 0: Background viewport */
  --surface-1: #121215;          /* 1: Base cards and grids */
  --surface-2: #18181c;          /* 2: Hovered states and dialogs */
  --surface-3: #222228;          /* 3: Dropdowns and popovers */

  /* Border Contrasts */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.10);
  --border-hover: rgba(255, 255, 255, 0.18);
  --border-focus: rgba(56, 189, 248, 0.60);

  /* Typography Scale */
  --text-micro: 11px;            /* Badges, timestamps, uppercase pill headers */
  --text-caption: 12px;          /* Secondary descriptions, hints */
  --text-sm: 14px;               /* Standard tablet/desktop body & form controls */
  --text-base: 16px;             /* Mobile input font-size (iOS Safari auto-zoom safeguard) */
  --text-title: 18px;            /* Card & section titles */
  --text-metric: 24px;           /* Large financial numbers & balance headers */

  /* Spacing Rhythm (4px Grid) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
}
```

---

## 5. The 5 Anti-Patterns: Eliminating the "AI Look"

| Anti-Pattern (What AI Generates) | Refero Standard (What Professionals Build) |
| :--- | :--- |
| **Oversaturated Purple/Pink Gradients** | Monochromatic dark surfaces with purposeful, desaturated accent colors. |
| **Low-Contrast Gray-on-Gray Text (`text-neutral-600`)** | High-contrast WCAG AA text (`text-neutral-200` for primary, `text-neutral-400` for secondary). |
| **Illegible Glassmorphism (`bg-white/5 backdrop-blur-sm`)** | High-opacity opaque or semi-opaque surfaces (`bg-neutral-900/90 border border-white/10`). |
| **Tiny 10px-12px Mobile Form Controls** | Strict `text-base sm:text-sm` (16px on mobile, 14px on desktop) to prevent iOS auto-zoom. |
| **Horizontal Scrolling Strips That Hide Buttons** | Responsive wrapping layouts (`grid-cols-2`, `grid-cols-3`, `flex-wrap`) where 100% of buttons are visible. |

---

## 6. Implementation Checklist for Any Interface

- [ ] **Surface Contrast**: Is every card distinctly separated from the background canvas by at least a 1px border (`border-white/10`) or distinct background color?
- [ ] **Tabular Figures**: Are all monetary numbers, timestamps, and percentages rendered with `font-mono tabular-nums` to prevent layout jitter on value changes?
- [ ] **Zero Horizontal Scroll**: Are all buttons, tabs, quick amount chips, and filter pills arranged in wrapping or responsive grid layouts?
- [ ] **44px Touch Targets**: Do all interactive buttons, select triggers, and modal close buttons have at least `min-h-[44px]` on touch viewports?
- [ ] **Tactile Feedback**: Do buttons implement `active:scale-95` tactile depression with smooth cubic-bezier transitions?
