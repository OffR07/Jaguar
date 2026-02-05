
import React, { useState } from 'react';
import { Card, Button, Input } from './UI';
import { Wallet, QrCode, ArrowUpRight, ArrowDownLeft, ShieldCheck, Info, History } from 'lucide-react';
import { User, AppView } from '../types';

interface WalletProps {
  user: User;
  onNavigate: (v: AppView) => void;
  updateBalance: (a: number) => void;
}

export const WalletSystem: React.FC<WalletProps> = ({ user, onNavigate, updateBalance }) => {
  const [view, setView] = useState<'options' | 'deposit' | 'withdraw'>('options');
  const [amount, setAmount] = useState('50.00');
  const [pixCopy, setPixCopy] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDepositRequest = () => {
    if (!user.email_verified) {
      alert("ATENÇÃO: Para realizar depósitos, você deve primeiro verificar seu e-mail em 'Minha Conta'.");
      onNavigate('account');
      return;
    }
    setLoading(true);
    // Simula chamada ao Asaas para gerar subconta e PIX
    setTimeout(() => {
      setLoading(false);
      setPixCopy("00020101021226850014br.gov.bcb.pix0123jaguar-da-sorte-baas-" + (Math.random() * 100000).toFixed(0));
    }, 1000);
  };

  const handleWithdrawRequest = () => {
    if (parseFloat(amount) > user.balance) {
      alert("Saldo insuficiente para saque!");
      return;
    }
    if (!user.pix_key) {
      alert("Você ainda não cadastrou uma chave PIX. Por favor, cadastre em 'Minha Conta' ou insira agora para salvar.");
      onNavigate('account');
      return;
    }
    
    setLoading(true);
    // Simula transferência Asaas Subconta -> Chave PIX
    setTimeout(() => {
      setLoading(false);
      updateBalance(-parseFloat(amount));
      alert(`Saque de R$ ${amount} realizado com sucesso! O valor cairá na sua conta em instantes via PIX Asaas.`);
      setView('options');
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
         <h2 className="text-2xl font-black text-amber-400 italic uppercase">Financeiro Jaguar</h2>
         <Button variant="ghost" onClick={() => alert("Histórico de transações em desenvolvimento...")} className="p-2 border-none">
            <History size={20} className="text-emerald-400" />
         </Button>
      </div>

      <Card className="bg-gradient-to-br from-emerald-900 to-black/80 border-amber-400/20 border-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Wallet size={120} />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-2">Saldo Disponível (Asaas)</p>
          <h2 className="text-5xl font-black text-white italic tracking-tighter">
            <span className="text-2xl text-amber-400 mr-2">R$</span>
            {user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
          <div className="flex gap-4 mt-8">
            <Button variant="secondary" className="flex-1 py-4 text-sm" onClick={() => setView('deposit')}>
              <ArrowDownLeft size={18} /> DEPÓSITO
            </Button>
            <Button variant="ghost" className="flex-1 py-4 text-sm border-white/10" onClick={() => setView('withdraw')}>
              <ArrowUpRight size={18} /> SAQUE
            </Button>
          </div>
        </div>
      </Card>

      {view === 'deposit' && (
        <Card className="space-y-6 animate-in slide-in-from-top-4 border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400"><QrCode /> <h3 className="font-black italic uppercase">Depósito Instantâneo</h3></div>
            <button onClick={() => setView('options')} className="text-emerald-400 text-[10px] font-black uppercase">Cancelar</button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {['20.00', '50.00', '100.00'].map(v => (
              <button key={v} onClick={() => setAmount(v)} className={`py-2 rounded-xl font-black text-xs border ${amount === v ? 'bg-amber-400 text-emerald-950 border-amber-400' : 'bg-white/5 text-white/60 border-white/5'}`}>R$ {v}</button>
            ))}
          </div>

          <Input label="Valor Personalizado" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
          
          {!pixCopy ? (
            <Button onClick={handleDepositRequest} loading={loading} className="w-full py-5">Gerar QR-CODE PIX</Button>
          ) : (
            <div className="text-center space-y-6 py-4 animate-in zoom-in">
               <div className="w-56 h-56 bg-white mx-auto rounded-[2rem] flex items-center justify-center p-6 shadow-2xl shadow-emerald-900/40">
                 {/* QR CODE PLACEHOLDER */}
                 <div className="w-full h-full bg-slate-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
                    <QrCode size={64} className="text-slate-300 mb-2" />
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Jaguar Asaas Pay</span>
                 </div>
               </div>
               <div className="space-y-3">
                 <Button onClick={() => { navigator.clipboard.writeText(pixCopy); alert("Chave PIX Copiada!") }} className="w-full bg-emerald-950 border border-amber-400/20">Copiar Código PIX</Button>
                 <p className="text-[10px] text-emerald-400 font-bold uppercase leading-relaxed max-w-[250px] mx-auto">
                   O saldo cairá na sua conta assim que o Asaas confirmar o recebimento do PIX.
                 </p>
               </div>
            </div>
          )}
        </Card>
      )}

      {view === 'withdraw' && (
        <Card className="space-y-6 animate-in slide-in-from-top-4 border-amber-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400"><ArrowUpRight /> <h3 className="font-black italic uppercase">Solicitar Saque</h3></div>
            <button onClick={() => setView('options')} className="text-emerald-400 text-[10px] font-black uppercase">Cancelar</button>
          </div>
          
          <div className="bg-amber-400/5 p-4 rounded-2xl flex gap-3 items-start border border-amber-400/10">
            <Info className="text-amber-400 shrink-0 mt-0.5" size={16} />
            <p className="text-[10px] text-amber-400 font-bold uppercase leading-relaxed tracking-wider">
              O saque será enviado exclusivamente para a chave PIX vinculada ao seu CPF. Verifique se os dados em "Minha Conta" estão corretos.
            </p>
          </div>

          <Input label="Valor para Saque (Disponível)" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
          
          <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
             <p className="text-[9px] font-black text-emerald-400/40 uppercase mb-1">Destino PIX</p>
             <p className="text-white font-black italic tracking-widest truncate">{user.pix_key || 'CADASTRE NA MINHA CONTA'}</p>
          </div>

          <Button onClick={handleWithdrawRequest} loading={loading} disabled={!user.pix_key} className="w-full py-5">Confirmar Saque Instantâneo</Button>
        </Card>
      )}

      <div className="bg-emerald-950 p-6 rounded-[2rem] border border-white/5 flex items-center gap-4">
         <ShieldCheck className="text-emerald-500 shrink-0" />
         <p className="text-[9px] text-emerald-400/60 font-black uppercase tracking-widest leading-relaxed">
           Seu saldo é mantido em uma subconta individual no Asaas vinculada ao seu CPF. Segurança bancária Jaguar.
         </p>
      </div>
    </div>
  );
};
