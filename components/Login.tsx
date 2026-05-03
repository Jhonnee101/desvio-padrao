import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
  onNavigateToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin, onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const user = users.find(u => u.email === email.trim() && u.senha === senha && u.ativo);
      
      if (user) {
        onLogin(user);
      } else {
        setError('Email ou senha inválidos, ou usuário inativo.');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-legal-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-legal-500 text-white w-16 h-16 flex items-center justify-center rounded-2xl font-bold text-3xl font-serif-legal mx-auto mb-4">
            D
          </div>
          <h1 className="text-3xl font-serif-legal font-bold text-legal-800">Desvio Padrão</h1>
          <p className="text-legal-400 mt-2">Faça login para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-legal-200 shadow-sm space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-legal-500 uppercase">Email</label>
            <input
              type="email"
              className="w-full border border-legal-200 rounded-xl p-3 outline-none focus:border-legal-500 focus:ring-2 focus:ring-legal-100 transition-all"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-legal-500 uppercase">Senha</label>
            <input
              type="password"
              className="w-full border border-legal-200 rounded-xl p-3 outline-none focus:border-legal-500 focus:ring-2 focus:ring-legal-100 transition-all"
              placeholder="••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-legal-500 text-white py-4 rounded-xl font-bold hover:bg-legal-600 shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="text-center pt-4 border-t border-legal-100">
            <p className="text-sm text-legal-400">
              Não tem conta?{' '}
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="text-legal-500 font-bold hover:underline"
              >
                Criar conta
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
