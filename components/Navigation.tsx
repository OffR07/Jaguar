
import React from 'react';
import { User as UserIcon, Wallet } from 'lucide-react';
import { User, AppView } from '../types.ts';
import { JaguarLogo } from './Icons.tsx';

interface NavProps {
  user: User;
  onNavigate: (page: AppView) => void;
}

export const TopNavigation: React.FC<NavProps> = ({ user, onNavigate }) => {
  return (
    <header className="sticky top-0 z-[100] w-full bg-emerald-950/95 backdrop-blur-md border-b border-white/5 px-2 md:px-6 py-1.5 md:py-3 flex justify-between items-center h-12 md:h-20">
      <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => onNavigate('home')}>
        <JaguarLogo className="w-5 h-5 md:w-10 md:h-10" />
        <h1 className="text-[10px] md:text-lg font-black text-white italic uppercase tracking-tighter">Jaguar</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex bg-black/30 rounded-lg p-0.5">
          <button onClick={() => onNavigate('wallet')} className="p-1.5 text-white/40 hover:text-amber-400 transition-colors">
            <Wallet size={14} />
          </button>
          <button onClick={() => onNavigate('account')} className="p-1.5 text-white/40 hover:text-amber-400 transition-colors">
            <UserIcon size={14} />
          </button>
        </div>
        
        <div className="bg-amber-400 text-emerald-950 px-2 py-1 rounded-md font-black text-[10px] md:text-sm flex items-center gap-1 shadow-md border border-amber-500/20">
           <span className="opacity-50 text-[7px] md:text-[8px] mt-0.5">R$</span> 
           {user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
      </div>
    </header>
  );
};
