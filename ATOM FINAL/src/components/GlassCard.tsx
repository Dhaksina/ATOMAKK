import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = true 
}) => {
  return (
    <div 
      className={`rounded-2xl transition-all duration-300 overflow-hidden ${
        hoverEffect 
          ? 'hover:-translate-y-1.5 hover:shadow-xl dark:hover:shadow-blue-500/5 hover:border-blue-500/30 dark:hover:border-blue-500/25' 
          : 'shadow-md'
      } glass-card ${className}`}
    >
      {children}
    </div>
  );
};
