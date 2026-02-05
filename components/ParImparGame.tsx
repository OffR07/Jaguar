
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, PlusCircle, Search, Trash2, Gamepad2, Users } from 'lucide-react';
import { User, Bet, GameType, SocketMessage } from '../types';
import { JaguarSocket } from '../services/socket';
import { Button, Card, Input } from './UI';
import { HandIcon } from './Icons';

interface GameProps {
  user: User;
  onBack: () => void;
  updateBalance: (amount: number) => void;
  bets: Bet[];
  setBets: React.Dispatch<React.SetStateAction<Bet[]>>;
}

export const ParImparGame: React.FC<GameProps> = ({ user, onBack, updateBalance, bets = [], setBets }) => {
  const [view, setView] = useState<'lobby' | 'create' | 'play'>('lobby');
  const [filterText, setFilterText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [newBet, setNewBet] = useState<{ amount: string; type: GameType; fingers: number }>({ 
    amount: "10.00", 
    type: 'par', 
    fingers: 0 
  });
  
  const [activeBet, setActiveBet] = useState<Bet | null>(null);
  const [playerFingers, setPlayerFingers] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'selection' | 'animating' | 'result'>('selection'); 

  const socketRef = useRef<JaguarSocket | null>(null);

  const handleSocketMessage = useCallback((msg: SocketMessage) => {
    if (msg.type === 'GAME_RESULT') {
      const { winner, resultTotal, resultPar, payout, betId } = msg.payload;
      
      setActiveBet(prev => prev ? ({
        ...prev,
        status: 'finished',
        winner,
        resultTotal,
        resultPar,
        challengerFingers: playerFingers || 0
      }) : null);

      setBets(prev => (prev || []).map(b => b.id === betId ? { ...b, status: 'finished', winner } : b));
      
      if (winner === user.username && payout > 0) {
          updateBalance(payout);
      }
      setGameState('result');
      setIsProcessing(false);
    }
  }, [user.username, playerFingers, updateBalance, setBets]);

  useEffect(() => {
    socketRef.current = new JaguarSocket(handleSocketMessage);
    return () => socketRef.current?.disconnect();
  }, [handleSocketMessage]);

  const handleCreateBet = () => {
    if (isProcessing) return;
    const val = parseFloat(newBet.amount.replace(',', '.'));
    if (isNaN(val) || val <= 0) return alert("Insira um valor válido!");
    if (val > user.balance) return alert("Saldo insuficiente!");
    
    setIsProcessing(true);
    const bet: Bet = {
      id: Date.now(),
      creator: user.username,
      amount: val,
      type: newBet.type,
      status: 'open',
      creatorFingers: newBet.fingers
    };
    
    updateBalance(-val);
    setBets(prev => [bet, ...(prev || [])]);
    setView('lobby');
    setNewBet({ amount: "10.00", type: 'par', fingers: 0 });
    setIsProcessing(false);
  };

  const handleEnterBet = (bet: Bet) => {
    if (isProcessing) return;
    if (user.balance < bet.amount) return alert("Você precisa de R$ " + bet.amount.toFixed(2) + " para aceitar.");
    
    setIsProcessing(true);
    setPlayerFingers(null);
    setGameState('selection');
    setActiveBet(bet);
    setView('play');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsProcessing(false);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!activeBet || playerFingers === null || isProcessing) return;
    
    setIsProcessing(true);
    updateBalance(-activeBet.amount);
    setGameState('animating');
    
    socketRef.current?.send({
      action: 'PLAY_PAR_IMPAR',
      payload: { 
        ...activeBet, 
        betId: activeBet.id, 
        playerFingers, 
        playerName: user.username, 
        creatorName: activeBet.creator,
        creatorType: activeBet.type
      }
    });
  };

  const lobbyBets = (bets || []).filter(b => 
    b.status === 'open' && 
    b.creator !== user.username && 
    b.creator.toLowerCase().includes(filterText.toLowerCase())
  );

  const myOpenBets = (bets || []).filter(b => 
    b.creator === user.username && 
    b.status === 'open'
  );

  if (view === 'create') {
    return (
      <div className="space-y-4 animate-in fade-in max-w-sm mx-auto p-4">
        <button onClick={() => setView('lobby')} className="flex items-center gap-1 text-amber-400 font-black text-[10px] uppercase">
          <ChevronLeft size={16} /> Voltar
        </button>
        <Card className="bg-white p-6 shadow-2xl">
          <h3 className="text-xl font-black text-emerald-950 uppercase italic text-center mb-6">Criar Desafio</h3>
          <div className="space-y-6">
            <Input 
              label="Valor da Aposta (R$)" 
              type="number" 
              value={newBet.amount} 
              onChange={e => setNewBet({...newBet, amount: e.target.value})} 
            />
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setNewBet({...newBet, type: 'par'})} className={`py-3 rounded-xl font-black text-xs transition-all ${newBet.type === 'par' ? 'bg-emerald-950 text-amber-400' : 'bg-emerald-50 text-emerald-950 opacity-40'}`}>PAR</button>
              <button onClick={() => setNewBet({...newBet, type: 'impar'})} className={`py-3 rounded-xl font-black text-xs transition-all ${newBet.type === 'impar' ? 'bg-emerald-950 text-amber-400' : 'bg-emerald-50 text-emerald-950 opacity-40'}`}>ÍMPAR</button>
            </div>
            <div className="bg-emerald-50 p-3 rounded-2xl grid grid-cols-6 gap-2">
              {[0,1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setNewBet({...newBet, fingers: n})} className={`p-2 rounded-xl transition-all ${newBet.fingers === n ? 'bg-amber-400 scale-110 shadow-lg' : 'bg-white opacity-30'}`}>
                  <HandIcon number={n} className="w-5 h-5" />
                </button>
              ))}
            </div>
            <Button onClick={handleCreateBet} disabled={isProcessing} className="w-full py-4 shadow-amber-950/20">POSTAR DESAFIO</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (view === 'play' && activeBet) {
    return (
      <div className="space-y-4 animate-in zoom-in max-w-md mx-auto p-2">
        <button onClick={() => setView('lobby')} className="text-white/40 font-black text-[10px] uppercase flex items-center gap-1">
          <ChevronLeft size={16} /> Sair
        </button>

        <Card className="bg-emerald-900 border-none p-6 min-h-[350px] flex flex-col justify-between shadow-2xl relative">
          <div className="flex justify-around items-center pt-8">
            <div className="text-center">
              <p className="text-[10px] text-white/30 uppercase font-black mb-2">{activeBet.creator}</p>
              <div className={gameState === 'animating' ? 'animate-bounce' : ''}>
                {gameState === 'result' ? <HandIcon number={activeBet.creatorFingers} className="w-16 h-16 -rotate-90" /> : <div className="text-5xl opacity-10 -rotate-90">✊</div>}
              </div>
            </div>

            <div className="text-center">
              {gameState === 'animating' && <p className="text-amber-400 font-black animate-pulse text-xs">DUELANDO...</p>}
              {gameState === 'result' && (
                <div className="bg-black/20 p-4 rounded-3xl border border-white/10">
                  <p className="text-5xl font-black italic">{activeBet.resultTotal}</p>
                  <p className="text-[10px] text-amber-400 font-bold uppercase mt-2">{activeBet.resultPar ? 'PAR' : 'ÍMPAR'}</p>
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-[10px] text-white/30 uppercase font-black mb-2">VOCÊ</p>
              <div className={gameState === 'animating' ? 'animate-bounce' : ''}>
                {gameState === 'result' ? <HandIcon number={playerFingers || 0} className="w-16 h-16 rotate-90" /> : <div className="text-5xl opacity-10 rotate-90">✊</div>}
              </div>
            </div>
          </div>

          <div className="bg-black/40 -mx-6 -mb-6 p-6 border-t border-white/5 rounded-t-[3rem]">
            {gameState === 'selection' && (
              <div className="space-y-4">
                <p className="text-center text-[10px] font-black text-white/40 uppercase tracking-widest italic">Escolha seus dedos:</p>
                <div className="flex justify-center gap-2">
                  {[0,1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setPlayerFingers(n)} className={`w-12 h-12 rounded-2xl text-xl font-black transition-all ${playerFingers === n ? 'bg-amber-400 text-emerald-950 scale-110 shadow-lg' : 'bg-white/5 text-white/30'}`}>{n}</button>
                  ))}
                </div>
                <Button onClick={handlePlay} disabled={playerFingers === null || isProcessing} className="w-full h-14">DUELAR AGORA</Button>
              </div>
            )}
            {gameState === 'result' && (
              <div className="text-center space-y-6 py-4">
                <p className={`text-3xl font-black italic ${activeBet.winner === user.username ? 'text-amber-400' : 'text-white/20'}`}>
                  {activeBet.winner === user.username ? 'VITÓRIA! 🐆' : 'DERROTA'}
                </p>
                <Button onClick={() => setView('lobby')} variant="secondary" className="w-full">VOLTAR PARA ARENA</Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in pb-10 px-2">
      <div className="flex items-center justify-between gap-2">
         <div>
           <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Arena Jaguar</h2>
           <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest mt-1">● Duelos em Tempo Real</p>
         </div>
         <Button onClick={() => setView('create')} variant="secondary" className="px-6 h-11"><PlusCircle size={18} /> NOVO DESAFIO</Button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-950/40" size={16} />
          <input 
            type="text" placeholder="Filtrar por jogador..." 
            className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 font-bold text-xs text-emerald-950 outline-none shadow-lg" 
            value={filterText} onChange={e => setFilterText(e.target.value)} 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lobbyBets.map(bet => (
            <Card 
              key={bet.id} 
              className="bg-white p-5 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border-none shadow-xl group" 
              onClick={() => handleEnterBet(bet)}
            >
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                     <div className="w-10 h-10 bg-emerald-950 rounded-2xl flex items-center justify-center text-amber-400 font-black italic">{bet.creator[0]}</div>
                     <p className="font-black text-emerald-950 text-xs uppercase truncate max-w-[90px]">{bet.creator}</p>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${bet.type === 'par' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>{bet.type}</span>
               </div>
               <div className="mb-4">
                  <p className="text-[9px] font-black text-emerald-900/20 uppercase tracking-widest mb-1">Prêmio Disponível</p>
                  <p className="text-2xl font-black text-emerald-950 italic leading-none">R$ {(bet.amount * 1.97).toFixed(2)}</p>
               </div>
               <div className="w-full bg-emerald-950 text-white font-black text-[11px] py-4 rounded-2xl text-center uppercase tracking-widest shadow-lg group-hover:bg-emerald-800 transition-colors">
                 ACEITAR DUELO
               </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
