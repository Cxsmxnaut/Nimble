import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: 'gradient-primary text-on-primary-container shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95',
    secondary: 'bg-secondary text-on-secondary hover:brightness-110 active:scale-95',
    tertiary: 'bg-tertiary text-on-tertiary hover:brightness-110 active:scale-95',
    ghost: 'hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface',
    outline: 'border border-outline-variant/30 hover:bg-surface-bright text-on-surface',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-full',
    md: 'px-6 py-2.5 text-base rounded-full font-bold',
    lg: 'px-8 py-3.5 text-lg rounded-xl font-bold',
    xl: 'px-10 py-4 text-xl rounded-xl font-black',
  };

  return (
    <button 
      className={cn(
        'transition-all duration-300 flex items-center justify-center gap-2 font-headline',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
