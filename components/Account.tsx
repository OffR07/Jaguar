
import React, { useState } from 'react';
import { Card, Button, Input } from './UI';
import { ShieldCheck, Mail, Key, User as UserIcon, CheckCircle2, AlertCircle, Fingerprint, CreditCard, ChevronLeft } from 'lucide-react';
import { User } from '../types';

interface AccountProps {
  user: User;
  onUpdate: (user: User) => void;
  onBack?: () => void;
}

export const MyAccount: React.FC<AccountProps> = ({ user, onUpdate, onBack }) => {
  const [step, setStep] = useState<'main' | 'verifying_email' | 'changing_pass' | 'changing_pix' | 'new_password'>('main');
  const [code, setCode] = useState('');
  const [newPix, setNewPix] = useState(user.pix_key || '');
  const [passData, setPassData] = useState({ p1: '', p2: '' });
  const [loading, setLoading] = useState(false);

  const sendCode = (target: string) => {
    setLoading(true);
    // Simulação de envio de e-mail via Backend Python
    console.log(`[BACKEND] Gerando código para ${target} e enviando para ${user.email}`);
    setTimeout(() => {
      setLoading(false);
      alert(`Código de segurança enviado com sucesso para ${user.email}`);
    }, 800);
  };

  const handleVerifyEmail = () => {
    if (code === '1234') { // Mock de verificação
      onUpdate({ ...user, email_verified: true });
      setStep('main');
      alert("E-mail verificado com sucesso! Seus depósitos agora estão liberados.");
    } else {
      alert("Código inválido! Tente '1234' para este teste.");
    }
  };

  const handleConfirmCodeForPass = () => {
    if (code === '1234') {
      setStep('new_password');
    } else {
      alert("Código de segurança incorreto.");
    }
  };

  const handleUpdatePassword = () => {
    if (passData.p1.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (passData.p1 === passData.p2) {
      alert("Senha atualizada no banco de dados com sucesso!");
      setStep('main');
      setPassData({ p1: '', p2: '' });
      setCode('');
    } else {
      alert("As senhas não coincidem.");
    }
  };

  const handleUpdatePix = () => {
    if (code === '1234') {
      onUpdate({ ...user, pix_key: newPix });
      setStep('main');
      alert("Sua chave PIX para saques foi atualizada com sucesso!");
    } else {
      alert("Código inválido.");
    }
  };

  // Sub-página: Verificação de Email
  if (step === 'verifying_email') {
    return (
      <Card className="max-w-md mx-auto space-y-6 animate-in zoom-in duration-300">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-amber-400" size={40} />
          </div>
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Validar E-mail</h3>
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest leading-relaxed">
            Enviamos um código de 4 dígitos para:<br/>
            <span className="text-white">{user.email}</span>
          </p>
        </div>
        <Input label="Digite o Código" placeholder="0000" value={code} onChange={e => setCode(e.target.value)} maxLength={4} className="text-center text-2xl tracking-[1em]" />
        <div className="space-y-3">
          <Button onClick={handleVerifyEmail} className="w-full">Verificar Agora</Button>
          <Button variant="ghost" onClick={() => setStep('main')} className="w-full">Voltar</Button>
        </div>
      </Card>
    );
  }

  // Sub-página: Alterar Senha (Inserir nova senha)
  if (step === 'new_password') {
    return (
      <Card className="max-w-md mx-auto space-y-6 animate-in zoom-in duration-300">
        <div className="text-center space-y-2">
          <Key className="mx-auto text-amber-400" size={48} />
          <h3 className="text-2xl font-black text-white italic uppercase">Nova Senha</h3>
          <p className="text-[10px] text-emerald-400 font-bold uppercase">Defina sua nova credencial de acesso</p>
        </div>
        <div className="space-y-4">
          <Input label="Nova Senha" type="password" value={passData.p1} onChange={e => setPassData({...passData, p1: e.target.value})} />
          <Input label="Confirmar Nova Senha" type="password" value={passData.p2} onChange={e => setPassData({...passData, p2: e.target.value})} />
        </div>
        <Button onClick={handleUpdatePassword} className="w-full">Salvar Nova Senha</Button>
      </Card>
    );
  }

  // Sub-página: Confirmação de Código para Senha ou PIX
  if (step === 'changing_pass' || step === 'changing_pix') {
    return (
      <Card className="max-w-md mx-auto space-y-6 animate-in zoom-in duration-300">
        <div className="text-center space-y-2">
          <ShieldCheck className="mx-auto text-amber-400" size={48} />
          <h3 className="text-2xl font-black text-white italic uppercase">Segurança</h3>
          <p className="text-[10px] text-emerald-400 font-bold uppercase">Confirme o código enviado ao seu e-mail</p>
        </div>
        {step === 'changing_pix' && <Input label="Nova Chave PIX (Mesmo CPF)" value={newPix} onChange={e => setNewPix(e.target.value)} />}
        <Input label="Código de Verificação" placeholder="0000" value={code} onChange={e => setCode(e.target.value)} maxLength={4} className="text-center text-2xl tracking-[1em]" />
        <Button onClick={step === 'changing_pass' ? handleConfirmCodeForPass : handleUpdatePix} className="w-full">Confirmar Mudança</Button>
        <Button variant="ghost" onClick={() => setStep('main')} className="w-full">Cancelar</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronLeft className="text-amber-400" /></button>}
          <h2 className="text-3xl font-black text-amber-400 italic uppercase tracking-tighter">Minha Conta</h2>
        </div>
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.email_verified ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
          {user.email_verified ? <CheckCircle2 size={14}/> : <AlertCircle size={14}/>}
          {user.email_verified ? 'Verificado' : 'Não Verificado'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 flex items-center gap-4 border-white/5">
          <div className="w-14 h-14 bg-emerald-950 rounded-2xl flex items-center justify-center text-amber-400 border border-white/5 shadow-inner">
            <UserIcon size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-400/40 uppercase tracking-widest">Identidade Jaguar</p>
            <p className="text-xl font-black text-white italic truncate">{user.username.toUpperCase()}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4 border-white/5">
          <div className="w-14 h-14 bg-emerald-950 rounded-2xl flex items-center justify-center text-amber-400 border border-white/5">
            <Mail size={24} />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] font-black text-emerald-400/40 uppercase tracking-widest">E-mail de Contato</p>
            <p className="text-sm font-black text-white truncate">{user.email}</p>
          </div>
          {!user.email_verified && (
            <button onClick={() => { sendCode('verificação'); setStep('verifying_email') }} className="bg-amber-400 text-emerald-950 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase hover:scale-105 transition-transform">Verificar</button>
          )}
        </Card>
      </div>

      <Card className="p-8 space-y-8 border-amber-400/10 border-2">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <Fingerprint className="text-amber-400" />
          <h4 className="font-black text-white uppercase tracking-[0.2em] italic">Segurança & Financeiro</h4>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
             <div className="p-4 bg-black/20 rounded-2xl border border-white/5 flex items-center justify-between">
               <div>
                  <p className="text-[9px] font-black text-emerald-400/60 uppercase mb-1">Subconta Asaas (CPF)</p>
                  <p className="text-white font-bold tracking-widest">{user.cpf ? user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***-$4") : 'NÃO VINCULADO'}</p>
               </div>
               <CreditCard className="text-emerald-800" />
             </div>

             <div className="flex flex-col md:flex-row gap-4">
               <div className="flex-1 p-4 bg-black/20 rounded-2xl border border-white/5">
                  <p className="text-[9px] font-black text-emerald-400/60 uppercase mb-1">Chave PIX Registrada</p>
                  <p className="text-white font-bold truncate">{user.pix_key || 'NENHUMA CADASTRADA'}</p>
               </div>
               <Button variant="ghost" className="md:w-auto w-full px-8 border-white/10" onClick={() => { sendCode('alteração de pix'); setStep('changing_pix') }}>Alterar PIX</Button>
             </div>
          </div>

          <div className="pt-4 flex flex-col md:flex-row gap-4">
            <Button variant="primary" className="flex-1 bg-emerald-900 border border-white/10" onClick={() => { sendCode('nova senha'); setStep('changing_pass') }}>
              <Key size={18} /> Alterar Senha de Acesso
            </Button>
          </div>
        </div>
      </Card>

      <p className="text-center text-[9px] font-black text-emerald-400/30 uppercase tracking-[0.3em]">
        Jaguar Segurança: Todas as alterações requerem validação via e-mail.
      </p>
    </div>
  );
};
