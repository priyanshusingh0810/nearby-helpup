import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: boolean;
  glowColor?: 'brand' | 'emergency' | 'success';
  animate?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = true,
  glow = false,
  glowColor = 'brand',
  animate = true,
  ...props 
}) => {
  const glowStyles: Record<string, string> = {
    brand: 'hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.15)]',
    emergency: 'hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.15)]',
    success: 'hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)]',
  };

  const baseClasses = `
    rounded-2xl border border-white/40 bg-white/72 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)]
    transition-all duration-300 ease-out
    dark:border-slate-800/50 dark:bg-slate-900/65 dark:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_-4px_rgba(0,0,0,0.2)]
    ${hoverEffect 
      ? `hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06),0_20px_48px_-8px_rgba(0,0,0,0.08)] hover:border-white/70 dark:hover:border-slate-700/60 dark:hover:bg-slate-900/75 ${glow ? glowStyles[glowColor] : ''}` 
      : ''
    }
  `.trim();

  const content = (
    <div
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default GlassCard;
