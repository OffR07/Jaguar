
import React, { useState, useEffect } from 'react';
import { User, AppView, Bet } from './types';
import { TopNavigation } from './components/Navigation';
import { AuthSystem } from './components/Auth';
import { MyAccount } from './components/Account';
import { WalletSystem } from './components/Wallet';
import { ParImparGame } from './components/ParImparGame';
import { Button, Card } from './components/UI';
import { JaguarLogo } from './components/Icons';

const INITIAL_MOCK_BETS: Bet[] = [
  { id: 201, creator: 'Mestre_Do_Pix', amount: 10.00, type: 'par', status: 'open', creatorFingers: 2 },
  { id: 202, creator: 'Dona_Sorte', amount: 50.00, type: 'impar', status: 'open', creatorFingers: 3 },
  { id: 203, creator: 'Jaguar_King', amount: 100.00, type: 'par', status: 'open', creatorFingers: 5 },
  { id: 204, creator: 'Bet_Feroz', amount: 20.00, type: 'impar', status: 'open', creatorFingers: 0 },
  { id: 205, creator: 'O_Estrategista', amount: 250.00, type: 'par', status: 'open', creatorFingers: 4 },
];

export default function App() {
  const [view, setView] = useState<AppView>('login');
  const [user, setUser] = useState<User | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('jaguar_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('home');
    }
    const savedBets = localStorage.getItem('jaguar_bets');
    if (savedBets) {
      setBets(JSON.parse(savedBets));
    } else {
      setBets(INITIAL_MOCK_BETS);
      localStorage.setItem('jaguar_bets', JSON.stringify(INITIAL_MOCK_BETS));
    }
  }, []);

  useEffect(() => {
    if (bets.length > 0) {
      localStorage.setItem('jaguar_bets', JSON.stringify(bets));
    }
  }, [bets]);

  const updateBalance = (amount: number) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, balance: prev.balance + amount };
      localStorage.setItem('jaguar_current_user', JSON.stringify(updated));
      return updated;
    });
  };

  if (!user || view === 'login' || view === 'register' || view === 'recovery') {
    return <AuthSystem view={view as any} setView={setView} onLogin={(u) => { 
      const loggedUser = { ...u, balance: 1000.00 }; 
      setUser(loggedUser); 
      setView('home'); 
      localStorage.setItem('jaguar_current_user', JSON.stringify(loggedUser)); 
    }} />;
  }

  return (
    <div className="min-h-screen bg-[#022c22] text-white font-sans overflow-x-hidden selection:bg-amber-400">
      <TopNavigation user={user} onNavigate={setView} />
      
      <main className="max-w-5xl mx-auto px-4 pt-4 md:pt-10 pb-28 md:pb-12">
        {view === 'home' && (
          <div className="space-y-6 md:space-y-12 animate-in fade-in">
            <section className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-16 relative overflow-hidden border border-white/5 shadow-2xl">
              <div className="relative z-10 space-y-6 md:space-y-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
                  SISTEMA ASAAS ATIVO
                </div>
                <h2 className="text-4xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.85]">
                  Arena <br/><span className="text-amber-400">Jaguar</span>
                </h2>
                <div className="flex flex-wrap gap-3 pt-4">
                  <Button onClick={() => setView('game_lobby')} variant="secondary" className="px-8 md:px-16 h-12 md:h-20 text-xs md:text-2xl shadow-amber-900/40">DUELAR AGORA</Button>
                  <Button onClick={() => setView('wallet')} variant="ghost" className="px-8 md:px-12 h-12 md:h-20 text-xs md:text-xl border-white/10">CARTEIRA</Button>
                </div>
              </div>
              <JaguarLogo className="absolute -right-10 -bottom-10 w-48 h-48 md:w-[40rem] md:h-[40rem] opacity-5 rotate-[20deg] grayscale" />
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-8">
               <Card className="p-6 md:p-10 border-white/5 group hover:border-amber-400/20 transition-all">
                  <h4 className="font-black text-white text-xs md:text-lg uppercase tracking-widest italic mb-2">Segurança Total</h4>
                  <p className="text-[10px] md:text-xs text-emerald-400/60 font-bold leading-relaxed">Depósitos protegidos via subconta Asaas personalizada.</p>
               </Card>
               <Card className="p-6 md:p-10 border-white/5 group hover:border-emerald-400/20 transition-all">
                  <h4 className="font-black text-white text-xs md:text-lg uppercase tracking-widest italic mb-2">Saque via PIX</h4>
                  <p className="text-[10px] md:text-xs text-emerald-400/60 font-bold leading-relaxed">Transferência direta para sua chave PIX CPF em segundos.</p>
               </Card>
               <Card className="p-6 md:p-10 border-white/5 group hover:border-amber-400/20 transition-all">
                  <h4 className="font-black text-white text-xs md:text-lg uppercase tracking-widest italic mb-2">Fair Play</h4>
                  <p className="text-[10px] md:text-xs text-emerald-400/60 font-bold leading-relaxed">Duelos validados em tempo real no servidor Jaguar.</p>
               </Card>
            </div>
          </div>
        )}

        {view === 'account' && <MyAccount user={user} onUpdate={setUser} onBack={() => setView('home')} />}
        {view === 'wallet' && <WalletSystem user={user} onNavigate={setView} updateBalance={updateBalance} />}
        {view === 'game_lobby' && <ParImparGame user={user} onBack={() => setView('home')} updateBalance={updateBalance} bets={bets} setBets={setBets} />}
      </main>

      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-emerald-950/98 backdrop-blur-3xl border-t border-white/5 p-3 flex justify-around items-center z-[200] h-20 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1.5 transition-all ${view === 'home' ? 'text-amber-400 scale-110' : 'text-white/20'}`}>
            <JaguarLogo className="w-5 h-5" /><span className="text-[8px] font-black uppercase tracking-widest">Home</span>
          </button>
          <button onClick={() => setView('game_lobby')} className={`flex flex-col items-center gap-1.5 transition-all ${view === 'game_lobby' ? 'text-amber-400 scale-125' : 'text-white/20'}`}>
             <div className={`p-2 rounded-2xl ${view === 'game_lobby' ? 'bg-amber-400/10' : 'bg-white/5'}`}><span className="text-lg">✊</span></div>
             <span className="text-[8px] font-black uppercase tracking-widest">Arena</span>
          </button>
          <button onClick={() => setView('wallet')} className={`flex flex-col items-center gap-1.5 transition-all ${view === 'wallet' ? 'text-amber-400 scale-110' : 'text-white/20'}`}>
             <div className={`p-2 rounded-2xl ${view === 'wallet' ? 'bg-amber-400/10' : 'bg-white/5'}`}>💰</div>
             <span className="text-[8px] font-black uppercase tracking-widest">Saldo</span>
          </button>
      </footer>
    </div>
  );
}
