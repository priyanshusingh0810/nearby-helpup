import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: boolean;
  glowColor?: 'brand' | 'emergency' | 'success';
  animate?: boolean;
  tilt?: boolean; // New prop for 3D tilt
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = true,
  glow = false,
  glowColor = 'brand',
  animate = true,
  tilt = true,
  delay = 0,
  ...props 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 20 });
  
  // Transform values for rotation
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ['-7deg', '7deg']);
  
  // Transform values for glare position
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['100%', '0%']);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['100%', '0%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !tilt) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const glowStyles: Record<string, string> = {
    brand: 'hover:shadow-[0_0_40px_-5px_rgba(79,70,229,0.25)]',
    emergency: 'hover:shadow-[0_0_40px_-5px_rgba(244,63,94,0.25)]',
    success: 'hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.25)]',
  };

  const baseClasses = `
    relative overflow-hidden rounded-2xl border border-white/40 bg-white/72 backdrop-blur-xl shadow-glass-light
    dark:border-slate-800/50 dark:bg-slate-900/65 dark:shadow-glass-dark
    transition-all duration-300 ease-out
    ${hoverEffect && !tilt
      ? `hover:-translate-y-[2px] hover:border-white/80 dark:hover:border-slate-600/60 dark:hover:bg-slate-900/80 ${glow ? glowStyles[glowColor] : ''}` 
      : ''
    }
    ${tilt ? 'transform-gpu' : ''}
  `.trim();

  const containerContent = (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {tilt && isHovered && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 rounded-2xl opacity-60 mix-blend-overlay dark:mix-blend-soft-light transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 60%)`,
            left: glareX,
            top: glareY,
            transform: 'translate(-50%, -50%)',
            width: '200%',
            height: '200%',
          }}
        />
      )}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: delay
        }}
        style={tilt ? { rotateX, rotateY, perspective: 1000 } : {}}
        className={tilt ? "preserve-3d" : ""}
      >
        {containerContent}
      </motion.div>
    );
  }

  if (tilt) {
    return (
      <motion.div
        style={{ rotateX, rotateY, perspective: 1000 }}
        className="preserve-3d"
      >
        {containerContent}
      </motion.div>
    );
  }

  return containerContent;
};

export default GlassCard;
