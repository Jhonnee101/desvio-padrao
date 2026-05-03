import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface AdminUsersProps {
  users: User[];
  currentUser: User;
  onAddUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  onBack: () => void;
}

const AdminUsers: React.FC<AdminUsersProps> = ({
  users,
  currentUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    role: 'student' as UserRole,
    ativo: true
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const filteredUsers = users.filter(u => {
    if (filterRole !== 'all' && u.role !== filterRole) return false;
    if (filterStatus === 'active' && !u.ativo) return false;
    if (filterStatus === 'inactive' && u.ativo) return false;
    if (searchTerm && !u.nome.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !u.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!formData.nome.trim() || !formData.email.trim() || !formData.senha) {
      setFormError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (users.some(u => u.email === formData.email.trim().toLowerCase())) {
      setFormError('Este email já está cadastrado.');
      return;
    }

    if (formData.senha.length < 4) {
      setFormError('A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    onAddUser({
      nome: formData.nome.trim(),
      email: formData.email.trim().toLowerCase(),
      senha: formData.senha,
      role: formData.role,
      ativo: formData.ativo
    });

    setFormSuccess('Usuário criado com sucesso!');
    setFormData({
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      role: 'student',
      ativo: true
    });

    setTimeout(() => {
      setActiveTab('list');
      setFormSuccess(null);
    }, 1500);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    onUpdateUser({
      ...editingUser,
      updatedAt: Date.now()
    });

    setEditingUser(null);
    setFormSuccess('Usuário atualizado com sucesso!');
    
    setTimeout(() => setFormSuccess(null), 2000);
  };

  const handleToggleActive = (user: User) => {
    onUpdateUser({
      ...user,
      ativo: !user.ativo,
      updatedAt: Date.now()
    });
  };

  const handleChangeRole = (user: User, newRole: UserRole) => {
    onUpdateUser({
      ...user,
      role: newRole,
      updatedAt: Date.now()
    });
  };

  const handleDeleteUser = (id: string) => {
    onDeleteUser(id);
    setShowDeleteConfirm(null);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'collaborator': return 'Colaborador';
      case 'student': return 'Estudante';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'collaborator': return 'bg-blue-100 text-blue-700';
      case 'student': return 'bg-green-100 text-green-700';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-legal-500 font-bold hover:underline flex items-center gap-1"
        >
          ← Voltar
        </button>
        <h2 className="text-2xl font-serif-legal font-bold text-legal-800">
          Gestão de Usuários
        </h2>
        <div className="w-24" />
      </header>

      <div className="flex gap-4 border-b border-legal-100">
        <button
          onClick={() => setActiveTab('list')}
          className={`pb-3 text-sm font-bold transition-all ${activeTab === 'list' ? 'text-legal-500 border-b-2 border-legal-500' : 'text-gray-400 hover:text-legal-300'}`}
        >
          Lista de Usuários ({users.length})
        </button>
        <button
          onClick={() => { setActiveTab('create'); setFormError(null); setFormSuccess(null); }}
          className={`pb-3 text-sm font-bold transition-all ${activeTab === 'create' ? 'text-legal-500 border-b-2 border-legal-500' : 'text-gray-400 hover:text-legal-300'}`}
        >
          Criar Conta
        </button>
      </div>

      {formError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
          ⚠️ {formError}
        </div>
      )}
      {formSuccess && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-bold border border-green-100">
          ✅ {formSuccess}
        </div>
      )}

      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-legal-200">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                className="w-full border border-legal-200 rounded-lg p-2 text-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border border-legal-200 rounded-lg p-2 text-sm"
              value={filterRole}
              onChange={e => setFilterRole(e.target.value as UserRole | 'all')}
            >
              <option value="all">Todas as funções</option>
              <option value="student">Estudantes</option>
              <option value="collaborator">Colaboradores</option>
              <option value="admin">Admins</option>
            </select>
            <select
              className="border border-legal-200 rounded-lg p-2 text-sm"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>

          <div className="bg-white rounded-xl border border-legal-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-legal-50">
                <tr>
                  <th className="text-left p-4 text-xs font-bold text-legal-500 uppercase">Nome</th>
                  <th className="text-left p-4 text-xs font-bold text-legal-500 uppercase">Email</th>
                  <th className="text-left p-4 text-xs font-bold text-legal-500 uppercase">Função</th>
                  <th className="text-left p-4 text-xs font-bold text-legal-500 uppercase">Status</th>
                  <th className="text-left p-4 text-xs font-bold text-legal-500 uppercase">Criado em</th>
                  <th className="text-center p-4 text-xs font-bold text-legal-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="border-t border-legal-100 hover:bg-legal-50">
                      <td className="p-4">
                        <div className="font-medium text-legal-800">{user.nome}</div>
                        {user.id === currentUser.id && (
                          <span className="text-xs text-legal-400">(você)</span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-gray-600">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {user.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-2 text-legal-500 hover:bg-legal-100 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleToggleActive(user)}
                            className={`p-2 rounded-lg transition-colors ${user.ativo ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                            title={user.ativo ? 'Inativar' : 'Ativar'}
                          >
                            {user.ativo ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10 10 0 0119.5 15.95a1 1 0 00-1.414-1.414l-2.352-2.352a10 10 0 01-12.323-12.323l1.473-1.473A1 1 0 003.707 2.293zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                          {user.id !== currentUser.id && (
                            <button
                              onClick={() => setShowDeleteConfirm(user.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 1v8a2 2 0 002 2h8a2 2 0 002-2V6h1.382l-.894-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="text-sm text-gray-500 text-right">
            Mostrando {filteredUsers.length} de {users.length} usuários
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <form onSubmit={handleCreateUser} className="bg-white p-8 rounded-2xl border border-legal-200 shadow-sm space-y-6 max-w-xl mx-auto">
          <h3 className="text-lg font-bold text-legal-800">Criar Nova Conta</h3>
          <p className="text-sm text-legal-400">Por padrão, novas contas são criadas como estudante.</p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-legal-500 uppercase">Nome Completo *</label>
              <input
                type="text"
                className="w-full border border-legal-200 rounded-xl p-3 outline-none focus:border-legal-500"
                value={formData.nome}
                onChange={e => setFormData({...formData, nome: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-legal-500 uppercase">Email *</label>
              <input
                type="email"
                className="w-full border border-legal-200 rounded-xl p-3 outline-none focus:border-legal-500"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-legal-500 uppercase">Senha *</label>
              <input
                type="password"
                className="w-full border border-legal-200 rounded-xl p-3 outline-none focus:border-legal-500"
                value={formData.senha}
                onChange={e => setFormData({...formData, senha: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-legal-500 uppercase">Função</label>
              <select
                className="w-full border border-legal-200 rounded-xl p-3 outline-none focus:border-legal-500"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
              >
                <option value="student">Estudante</option>
                <option value="collaborator">Colaborador</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ativo"
                className="w-4 h-4 accent-legal-500"
                checked={formData.ativo}
                onChange={e => setFormData({...formData, ativo: e.target.checked})}
              />
              <label htmlFor="ativo" className="text-sm text-legal-700">Conta ativa</label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-legal-500 text-white py-4 rounded-xl font-bold hover:bg-legal-600 shadow-lg transition-all"
          >
            Criar Conta
          </button>
        </form>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-legal-800 mb-4">Editar Usuário</h3>
            
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-legal-500 uppercase">Nome</label>
                <input
                  type="text"
                  className="w-full border border-legal-200 rounded-xl p-3 outline-none focus:border-legal-500"
                  value={editingUser.nome}
                  onChange={e => setEditingUser({...editingUser, nome: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-legal-500 uppercase">Email</label>
                <input
                  type="email"
                  className="w-full border border-legal-200 rounded-xl p-3 outline-none focus:border-legal-500"
                  value={editingUser.email}
                  onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-legal-500 uppercase">Nova Senha</label>
                <input
                  type="password"
                  className="w-full border border-legal-200 rounded-xl p-3 outline-none focus:border-legal-500"
                  placeholder="Deixe em branco para manter atual"
                  value={editingUser.senha}
                  onChange={e => setEditingUser({...editingUser, senha: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-legal-500 uppercase">Função</label>
                <select
                  className="w-full border border-legal-200 rounded-xl p-3 outline-none focus:border-legal-500"
                  value={editingUser.role}
                  onChange={e => setEditingUser({...editingUser, role: e.target.value as UserRole})}
                >
                  <option value="student">Estudante</option>
                  <option value="collaborator">Colaborador</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-ativo"
                  className="w-4 h-4 accent-legal-500"
                  checked={editingUser.ativo}
                  onChange={e => setEditingUser({...editingUser, ativo: e.target.checked})}
                />
                <label htmlFor="edit-ativo" className="text-sm text-legal-700">Conta ativa</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 border border-legal-200 text-legal-700 py-3 rounded-xl font-bold hover:bg-legal-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-legal-500 text-white py-3 rounded-xl font-bold hover:bg-legal-600"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-red-600 mb-2">Confirmar Exclusão</h3>
            <p className="text-legal-600 mb-6">Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 border border-legal-200 text-legal-700 py-3 rounded-xl font-bold hover:bg-legal-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteConfirm)}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;