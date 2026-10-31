---
name: cult-ui
description: "Design engineer component library (cult-ui.com / nolly-studio/cult-ui) featuring fluid micro-interactions, spring physics, animated text engines, spotlight cards, magnetic buttons, and creative motion primitives extending the shadcn/ui ecosystem."
---

# Cult UI Skill

Design engineering patterns, expressive micro-interactions, and motion primitives based on **Cult UI** (`cult-ui.com`) created by Jordan Gilliam and maintained by Nolly Studio.

---

## 1. Overview & Philosophy

Cult UI is an open-source, design-engineering focused component library built to elevate standard **shadcn/ui** applications into fluid, tactile, and visually unforgettable experiences.

### Core Tenets:
1. **Details That Pop**: Focus on subtle physics, tactile hover feedback, cursor-tracking lighting, and expressive transitions.
2. **Copy-and-Paste Ownership**: Code lives inside your codebase. Zero external bundle bloat or third-party proprietary dependencies.
3. **Hardware-Accelerated Physics**: Relies on GPU-accelerated CSS transforms (`translate3d`, `scale`, `opacity`) and Framer Motion spring physics.
4. **Accessible by Default**: Animations respect `prefers-reduced-motion` and never hijack standard keyboard navigation or screen readers.

---

## 2. When to Use This Skill

Use this skill when:
- Designing **interactive cards** that react to mouse coordinates with dynamic radial spotlight glows.
- Building **magnetic buttons** that subtly follow the user's cursor for premium desktop polish.
- Implementing **text animation engines** (e.g. typewriter effects, character blur-ins, or rolling financial numbers).
- Adding **animated border beams** that run along card borders without heavy Canvas or SVG overhead.
- Elevating financial dashboards, hero sections, and modals with tactile spring physics.

---

## 3. Motion Primitives & Physics Constants

Standardize motion across your application with these calibrated spring configurations:

```ts
export const cultSprings = {
  // Snappy for buttons, pills, and toggles
  snappy: { type: 'spring', stiffness: 400, damping: 25 },
  // Smooth for page transitions, drawers, and layout changes
  smooth: { type: 'spring', stiffness: 260, damping: 30 },
  // Gentle for magnetic pulls and spotlight interpolation
  magnetic: { type: 'spring', stiffness: 150, damping: 15, mass: 0.1 },
  // Bouncy for success badges and attention-grabbing chips
  bouncy: { type: 'spring', stiffness: 500, damping: 15 },
};
```

---

## 4. Component Recipes

### 4.1 Spotlight Interactive Card
A card that casts a subtle radial light source following cursor position across the card's boundary:

```tsx
import React, { useRef, useState, useCallback } from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
}

export const CultSpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(56, 189, 248, 0.15)', // Sky glow
  ...props
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseEnter = useCallback(() => setOpacity(1), []);
  const handleMouseLeave = useCallback(() => setOpacity(0), []);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-2xl border border-white/10 bg-neutral-900/80 p-5 overflow-hidden transition-all duration-300 hover:border-white/20 shadow-xl ${className}`}
      {...props}
    >
      {/* Radial Spotlight Gradient */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 -z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
```

---

### 4.2 Magnetic Tactile Button
Pulls gently toward the user's cursor on desktop viewports, with automatic mobile fallback:

```tsx
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
}

export const CultMagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.35,
  className = '',
  ...props
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={`min-h-[44px] min-w-[44px] rounded-xl px-4 py-2 font-medium active:scale-95 transition-shadow ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};
```

---

### 4.3 Text Animate: Number Ticker (Financial Math Safe)
Fluid rolling number ticker designed for financial dashboards. Receives exact integer paise and animates without IEEE-754 floating-point drift:

```tsx
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { formatINR } from '@/lib/accounting/currency';

interface NumberTickerProps {
  valuePaise: bigint;
  className?: string;
}

export const CultNumberTicker: React.FC<NumberTickerProps> = ({ valuePaise, className = '' }) => {
  const numericValue = Number(valuePaise) / 100;
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const [displayValue, setDisplayValue] = useState(formatINR(0n));

  useEffect(() => {
    spring.set(numericValue);
  }, [numericValue, spring]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      const currentPaise = BigInt(Math.round(latest * 100));
      setDisplayValue(formatINR(currentPaise));
    });
    return () => unsubscribe();
  }, [spring]);

  return (
    <span className={`font-mono font-bold tracking-tight tabular-nums ${className}`}>
      {displayValue}
    </span>
  );
};
```

---

### 4.4 Animated Border Beam
An elegant continuous light beam that circuits the perimeter of a card without heavy overhead:

```tsx
import React from 'react';

interface BorderBeamProps {
  durationSeconds?: number;
  colorFrom?: string;
  colorTo?: string;
}

export const CultBorderBeam: React.FC<BorderBeamProps> = ({
  durationSeconds = 8,
  colorFrom = '#38bdf8',
  colorTo = '#818cf8',
}) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
      style={{
        maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
        maskComposite: 'exclude',
        WebkitMaskComposite: 'xor',
        padding: '1px',
      }}
    >
      <div
        className="absolute inset-[-100%] animate-spin-slow opacity-60"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${colorFrom} 60deg, ${colorTo} 120deg, transparent 180deg)`,
          animationDuration: `${durationSeconds}s`,
        }}
      />
    </div>
  );
};
```

---

## 5. Design Engineering Rules of Thumb

1. **Keep Motion Purposeful**: Never animate purely for the sake of animation. Every motion must communicate state change, spatial hierarchy, or tactile confirmation.
2. **Respect Reduced Motion**: Always wrap continuous animations in media queries:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```
3. **No Layout Shifts**: Always use `transform: translate3d(x, y, 0)` or `scale()` instead of animating `top`, `left`, `width`, or `height`.
4. **Combine with Envello's Taxonomy**: Interactive animations like the `CultNumberTicker` must respect Envello's 6 explicit balance categories—never aggregate spendable cash with credit limits.
