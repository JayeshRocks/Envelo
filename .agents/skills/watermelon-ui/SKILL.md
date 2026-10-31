---
name: watermelon-ui
description: "Modern open-source React component registry and UI kit (ui.watermelon.sh / WatermelonCorp/watermelon-platform) featuring animated Tailwind CSS components, metric blocks, dashboard cards, and production-ready SaaS templates built with React, Radix UI, Motion, and Tailwind."
---

# Watermelon UI Skill

Comprehensive engineering guide and component registry architecture based on **Watermelon UI** (`ui.watermelon.sh`) and the open-source platform [`WatermelonCorp/watermelon-platform`](https://github.com/WatermelonCorp/watermelon-platform).

---

## 1. Overview & Philosophy

Watermelon UI is a modern, open-source React component platform and registry designed for rapid composition of production-grade SaaS products, dashboards, and landing pages.

### Core Stack
- **Framework**: React 19 / Next.js / Vite + TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (Utility-first with custom CSS variables and surface tokens)
- **Primitives**: Radix UI (Unstyled, fully accessible WAI-ARIA compliant primitives)
- **Animation**: Motion / Framer Motion (Fluid layout animations and spring physics)
- **Distribution Model**: Copy-and-paste component registry (code lives in your project, zero lock-in)
- **Runtime**: Bun / Node.js

---

## 2. When to Use This Skill

Activate this skill when:
- Designing or building **SaaS dashboard layouts**, metric cards, or visual financial overviews.
- Creating **asymmetric Bento grids** with subtle borders and illuminated interactive states.
- Implementing **copy-paste component registries** or reusable component blocks.
- Building **high-performance interactive cards**, micro-sparklines, and step-by-step progress flows.
- Structuring components that require **Radix UI accessibility** paired with **fluid Motion animations**.

---

## 3. Design Tokens & Visual Hierarchy

Watermelon UI relies on high-contrast dark surfaces, fine border outlines, and subtle glow backdrops:

### Surface Elevation Scale
```css
--surface-bg: #09090b;        /* App canvas base */
--surface-card: #121215;      /* Primary card container */
--surface-elevated: #18181b;  /* Popovers, modals, dropdowns */
--surface-border: rgba(255, 255, 255, 0.08); /* 1px crisp outline */
--surface-border-hover: rgba(255, 255, 255, 0.18);
```

### Motion Physics Tokens
```ts
export const watermelonTransition = {
  spring: { type: "spring", stiffness: 300, damping: 25 },
  smooth: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  fade: { duration: 0.15, ease: "easeOut" },
};
```

---

## 4. Reusable Component Recipes

### 4.1 Animated Stat Metric Card
A high-impact metric display card featuring animated numerical counters, status badges, and sparkline progress.

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  changePercent: number;
  changeLabel?: string;
  sparklineData?: number[];
  icon?: React.ReactNode;
}

export const WatermelonMetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  changePercent,
  changeLabel = 'vs last month',
  icon,
}) => {
  const isPositive = changePercent >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="p-5 rounded-2xl bg-neutral-900/70 border border-white/10 hover:border-white/20 shadow-xl backdrop-blur-md relative overflow-hidden group"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 group-hover:scale-105 transition-transform">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
          {value}
        </div>
        <div
          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
            isPositive
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          <span>{Math.abs(changePercent).toFixed(1)}%</span>
        </div>
      </div>

      <div className="mt-2 text-[11px] text-neutral-500 flex items-center justify-between">
        <span>{changeLabel}</span>
      </div>
    </motion.div>
  );
};
```

---

### 4.2 Interactive Bento Grid Block
Bento grid layout with subtle border glow and responsive scaling across mobile, tablet, and PC.

```tsx
import React from 'react';

export const WatermelonBentoGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)] w-full">
      {children}
    </div>
  );
};

export const WatermelonBentoCard: React.FC<{
  title: string;
  description: string;
  span?: 'col-span-1' | 'col-span-2' | 'col-span-3';
  children?: React.ReactNode;
}> = ({ title, description, span = 'col-span-1', children }) => {
  return (
    <div
      className={`rounded-2xl p-6 bg-neutral-900/60 border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${span}`}
    >
      <div className="space-y-1.5 z-10">
        <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-neutral-400 max-w-md leading-relaxed">{description}</p>
      </div>
      <div className="mt-4 z-10">{children}</div>
    </div>
  );
};
```

---

### 4.3 Mobile-Ergonomic Segmented Control (Zero Horizontal Scroll)
Following Envello's non-negotiable rule: **never hide buttons or tabs in horizontal scrolling strips**. Arranges tabs in a responsive segmented wrapping bar.

```tsx
import React from 'react';
import { motion } from 'framer-motion';

interface SegmentedTab<T extends string> {
  id: T;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  tabs: SegmentedTab<T>[];
  activeTab: T;
  onChange: (id: T) => void;
}

export function WatermelonSegmentedControl<T extends string>({
  tabs,
  activeTab,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-neutral-900/90 border border-white/10 w-full sm:w-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 active:scale-95 min-h-[44px] sm:min-h-[38px] flex items-center justify-center space-x-1.5 cursor-pointer select-none ${
              isActive ? 'text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="watermelon-active-pill"
                className="absolute inset-0 rounded-xl bg-white/10 border border-white/15 shadow-sm"
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              />
            )}
            {tab.icon && <span className="relative z-10">{tab.icon}</span>}
            <span className="relative z-10">{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="relative z-10 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-white/10">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
```

---

## 5. Engineering Best Practices

1. **Deterministic Radix Primitive Wrapping**:
   Always wrap raw Radix UI primitives (`@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-tooltip`) in semantic, reusable workspace components rather than instantiating raw primitives directly in page views.
2. **Accessible Portals**:
   Render all overlays and modals using `ModalPortal` (`createPortal(..., document.body)`) to escape parent overflow-hidden boundaries and guarantee edge-to-edge backdrop blur.
3. **Paise Precision Invariant**:
   Financial data rendered in metric cards, bento blocks, or sparklines must strictly accept `bigint` paise and format via `formatINR()`. Never perform floating-point calculations inside UI display components.
4. **44px Minimum Touch Targets**:
   All buttons, segmented tabs, and dismiss controls must satisfy `min-h-[44px]` on mobile/tablet viewports.
