
import React, { useState } from 'react';
import { Card, Button, Input } from './UI.tsx';
import { JaguarLogo } from './Icons.tsx';

interface AuthProps {
  onLogin: (user: any) => void;
  view: 'login' | 'register' | 'recovery';
  setView: (v: any) => void;
}

export const AuthSystem: React.FC<AuthProps> = ({ onLogin, view, setView }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirm: '', code: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    onLogin({ 
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      username: formData.username || 'UsuarioJaguar',
      email: formData.email || 'teste@jaguar.com',
      email_verified: false,
      balance: 100.00,
      joinDate: new Date().toLocaleDateString()
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-emerald-950">
      <Card className="w-full max-w-md space-y-6">
        <div className="text-center">
          <JaguarLogo className="w-24 h-24 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-amber-400 italic uppercase tracking-tighter">
            {view === 'login' ? 'Bem-vindo de Volta' : view === 'register' ? 'Criar Conta Jaguar' : 'Recuperar Acesso'}
          </h2>
        </div>
        <div className="space-y-4">
          {view === 'register' && <Input label="Username" placeholder="Como quer ser chamado?" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />}
          <Input label="E-mail" type="email" placeholder="seu@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          {view !== 'recovery' && <Input label="Senha" type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />}
        </div>
        <Button onClick={handleSubmit} loading={loading} className="w-full py-5 text-lg">Entrar na Arena</Button>
        <div className="flex justify-between px-2">
          <button onClick={() => setView(view === 'login' ? 'register' : 'login')} className="text-[10px] font-black text-amber-400 uppercase">
            {view === 'login' ? 'Criar nova conta' : 'Já tenho conta'}
          </button>
        </div>
      </Card>
    </div>
  );
};
