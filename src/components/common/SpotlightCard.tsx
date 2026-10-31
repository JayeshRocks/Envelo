import React, { useState, useRef, useCallback } from 'react';

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
  as?: 'div' | 'button' | 'section';
  onClick?: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
}

/**
 * Cult UI Spotlight Card
 * Tracks mouse position and renders a smooth radial ambient illumination across the card border and surface.
 * Gracefully degrades on touch viewports without layout shifts.
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  spotlightColor = 'rgba(56, 189, 248, 0.15)',
  className = '',
  as = 'div',
  onClick,
  disabled = false,
  ...props
}) => {
  const cardRef = useRef<any>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const baseClasses = `relative rounded-2xl border border-white/10 bg-[#0f1011] p-5 sm:p-6 transition-all duration-300 hover:border-white/20 shadow-xl overflow-hidden group ${className}`;

  const radialStyle = {
    opacity: isHovered ? 1 : 0,
    background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 65%)`,
  };

  if (as === 'button') {
    return (
      <button
        ref={cardRef}
        type="button"
        disabled={disabled}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`${baseClasses} text-left cursor-pointer active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-500/40`}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
          style={radialStyle}
        />
        <div className="relative z-10 w-full">{children}</div>
      </button>
    );
  }

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={baseClasses}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
        style={radialStyle}
      />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};
