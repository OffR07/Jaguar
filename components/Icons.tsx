
import React from 'react';

export const JaguarLogo: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#065f46" />
        <stop offset="100%" stopColor="#064e3b" />
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="95" fill="url(#greenGradient)" stroke="url(#goldGradient)" strokeWidth="4" />
    <circle cx="100" cy="100" r="85" fill="none" stroke="#FCD34D" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
    <path d="M100 40 C120 40 140 50 140 80 C140 110 120 120 120 120 L110 110 C110 110 125 105 125 80 C125 65 115 55 100 55 C85 55 75 65 75 80 L75 120 C75 145 90 160 115 160 L125 160" fill="none" stroke="url(#goldGradient)" strokeWidth="12" strokeLinecap="round"/>
    <path d="M100 130 L105 140 L115 140 L108 150 L110 160 L100 155 L90 160 L92 150 L85 140 L95 140 Z" fill="#FCD34D" />
    <circle cx="60" cy="70" r="3" fill="#FCD34D" />
    <circle cx="140" cy="70" r="3" fill="#FCD34D" />
  </svg>
);

export const HandIcon: React.FC<{ number: number; className?: string }> = ({ number, className = "w-12 h-12" }) => {
  const emojis = ["✊", "☝️", "✌️", "🤟", "🖖", "🖐️"];
  return (
    <div className={`flex items-center justify-center text-4xl select-none transition-transform hover:scale-110 ${className}`}>
      {emojis[number] || "✊"}
    </div>
  );
};
