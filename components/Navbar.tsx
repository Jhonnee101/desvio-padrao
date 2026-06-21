
import React, { useState } from 'react';
import { View, User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  onNavigate: (view: View) => void;
  currentView: View;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout, onNavigate, currentView }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'collaborator': return 'Colaborador';
      case 'student': return 'Estudante';
      default: return role;
    }
  };

  return (
    <nav className="bg-white border-b border-legal-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => onNavigate(currentUser ? 'dashboard' : 'landing')}
        >
          <div className="bg-legal-500 text-white w-8 h-8 flex items-center justify-center rounded font-bold text-xl font-serif-legal">
            D
          </div>
          <span className="text-xl font-bold font-serif-legal text-legal-800 tracking-tight uppercase">
            Desvio Padrão
          </span>
        </div>

        <div className="flex items-center space-x-6">
          {currentUser && (
            <button 
              onClick={() => onNavigate('dashboard')}
              className={`text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'text-legal-500' : 'text-gray-500 hover:text-legal-500'}`}
            >
              Matérias
            </button>
          )}

          {(currentUser?.role === 'admin' || currentUser?.role === 'collaborator') && (
            <>
              <button 
                onClick={() => onNavigate('admin')}
                className={`text-sm font-medium transition-colors ${currentView === 'admin' ? 'text-legal-500' : 'text-gray-500 hover:text-legal-500'}`}
              >
                BANCO
              </button>
              {currentUser.role === 'admin' && (
                <button 
                  onClick={() => onNavigate('admin-users')}
                  className={`text-sm font-medium transition-colors ${currentView === 'admin-users' ? 'text-legal-500' : 'text-gray-500 hover:text-legal-500'}`}
                >
                  Usuários
                </button>
              )}
            </>
          )}

          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 hover:bg-legal-50 rounded-lg px-2 py-1 transition-colors"
            >
              <div className="h-8 w-8 bg-legal-100 rounded-full flex items-center justify-center text-legal-500 border border-legal-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-legal-700 hidden md:block">{currentUser?.nome.split(' ')[0]}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-legal-200 shadow-lg overflow-hidden">
                <div className="p-3 border-b border-legal-100">
                  <p className="font-medium text-legal-800 text-sm">{currentUser?.nome}</p>
                  <p className="text-xs text-legal-400">{currentUser?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-legal-100 text-legal-600 text-xs rounded-full">
                    {getRoleLabel(currentUser?.role || '')}
                  </span>
                </div>
                <div className="py-1">
                  <button 
                    onClick={() => { onNavigate('student-panel'); setShowUserMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-legal-700 hover:bg-legal-50"
                  >
                    Meu Painel
                  </button>
                  <button 
                    onClick={() => { onLogout(); setShowUserMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
