
import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost', loading?: boolean }> = ({ 
  children, variant = 'primary', className = '', loading, ...props 
}) => {
  const base = "font-black py-2.5 px-4 md:py-3.5 md:px-6 rounded-xl md:rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 italic uppercase tracking-wider text-[11px] md:text-sm shadow-xl";
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/40",
    secondary: "bg-amber-400 hover:bg-amber-500 text-emerald-950 shadow-amber-900/30",
    danger: "bg-rose-600 hover:bg-rose-700 text-white",
    ghost: "bg-white/5 hover:bg-white/10 text-emerald-100 border border-white/10"
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {loading && <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />}
      {children}
    </button>
  );
};

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => (
  <div className={`bg-emerald-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 shadow-2xl ${className}`} {...props}>
    {children}
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = "", ...props }) => (
  <div className="space-y-1 w-full">
    {label && <label className="text-[9px] md:text-[10px] font-black text-emerald-400/60 uppercase tracking-[0.2em] ml-2">{label}</label>}
    <input 
      className={`w-full bg-white border-2 border-emerald-900/5 rounded-xl md:rounded-2xl p-3 md:p-4 text-emerald-950 font-bold outline-none focus:border-amber-400/30 transition-all text-sm md:text-base shadow-inner ${className}`} 
      {...props} 
    />
  </div>
);
