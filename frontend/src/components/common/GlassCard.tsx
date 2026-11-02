import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: boolean;
  glowColor?: 'brand' | 'emergency' | 'success';
  animate?: boolean;
  tilt?: boolean;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = true,
  animate = true,
  delay = 0,
  ...props 
}) => {
  const baseClasses = `
    relative overflow-hidden rounded-2xl border border-[#E2E8F0] dark:border-[#334155] 
    bg-white dark:bg-[#1E293B] text-[#1E293B] dark:text-[#F8FAFC] shadow-sm
    transition-all duration-200 ease-out
    ${hoverEffect ? 'hover:shadow-md hover:border-[#19A974]/40 hover:-translate-y-[1px]' : ''}
  `.trim();

  const containerContent = (
    <div
      className={`${baseClasses} ${className}`}
      {...props}
    >
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.35, 
          ease: "easeOut",
          delay: delay
        }}
      >
        {containerContent}
      </motion.div>
    );
  }

  return containerContent;
};

export default GlassCard;

