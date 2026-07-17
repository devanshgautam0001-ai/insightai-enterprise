import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  label
}) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <div 
        className={`${sizes[size]} border-zinc-800 border-t-brand-accent rounded-full animate-spin`} 
      />
      {label && <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{label}</p>}
    </div>
  );
};
