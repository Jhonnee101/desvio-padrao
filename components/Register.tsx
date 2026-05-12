import React, { useState } from 'react';
import { User } from '../types';

interface RegisterProps {
  onRegister: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onBackToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onBackToLogin }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      setError('Preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      setError('As senhas não conferem.');
      return;
    }

    if (senha.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    setLoading(true);

    try {
      await onRegister({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: senha,
        role: 'student',
        ativo: true
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-legal-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-legal-500 text-white w-16 h-16 flex items-center justify-center rounded-2xl font-bold text-3xl font-serif-legal mx-auto mb-4">
            D
          </div>
          <h1 className="text-3xl font-serif-legal font-bold text-legal-800">Criar Conta</h1>
          <p className="text-legal-400 mt-2">Estude com organização</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-legal-200 shadow-sm space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-legal-500 uppercase">Nome Completo</label>
            <input
              type="text"
              className="w-full border border-legal-200 rounded-xl p-3 outline-none focus:border-legal-500 focus:ring-2 focus:ring-legal-100 transition-all"
              placeholder="Seu nome"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
          </div>

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
              placeholder="Mínimo 4 caracteres"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-legal-500 uppercase">Confirmar Senha</label>
            <input
              type="password"
              className="w-full border border-legal-200 rounded-xl p-3 outline-none focus:border-legal-500 focus:ring-2 focus:ring-legal-100 transition-all"
              placeholder="Repita a senha"
              value={confirmarSenha}
              onChange={e => setConfirmarSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-legal-500 text-white py-4 rounded-xl font-bold hover:bg-legal-600 shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>

          <div className="text-center pt-4 border-t border-legal-100">
            <p className="text-sm text-legal-400">
              Já tem conta?{' '}
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-legal-500 font-bold hover:underline"
              >
                Fazer login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
