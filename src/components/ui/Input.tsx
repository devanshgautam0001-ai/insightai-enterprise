import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-mono text-zinc-400 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={`w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 text-sm text-white focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all placeholder:text-zinc-600 ${
            icon ? 'pl-11' : 'px-4'
          } ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
    </div>
  );
};
