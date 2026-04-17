import React from 'react';
import { cn } from '../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'boost';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className }) => {
  const variants = {
    primary: 'bg-blue-100 text-blue-700',
    secondary: 'bg-gray-100 text-gray-700',
    accent: 'bg-purple-100 text-purple-700',
    outline: 'border border-gray-200 text-gray-600',
    boost: 'bg-yellow-100 text-yellow-700 font-bold border border-yellow-200',
  };

  return (
    <span className={cn('px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold', variants[variant], className)}>
      {children}
    </span>
  );
};
