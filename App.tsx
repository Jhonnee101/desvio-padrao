import React, { useState, useEffect } from 'react';
import { View, Question, INITIAL_SUBJECTS, PerformanceRecord, User, UserRole } from './types';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import QuestionSolver from './components/QuestionSolver';
import AdminPanel from './components/AdminPanel';
import AdminUsers from './components/AdminUsers';
import StudentPanel from './components/StudentPanel';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<string[]>(INITIAL_SUBJECTS);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [errorNotebookIds, setErrorNotebookIds] = useState<string[]>([]);
  const [performance, setPerformance] = useState<PerformanceRecord[]>([]);
  const [userComments, setUserComments] = useState<Record<string, string>>({});

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);

        const { data: usersData } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (usersData && usersData.length > 0) {
          const mappedUsers: User[] = usersData.map(u => ({
            id: u.id,
            nome: u.nome,
            email: u.email,
            senha: u.senha,
            role: u.role,
            ativo: u.ativo,
            createdAt: new Date(u.created_at).getTime(),
            updatedAt: new Date(u.updated_at).getTime()
          }));
          setUsers(mappedUsers);
        } else {
          const defaultAdmin: User = {
            id: '00000000-0000-0000-0000-000000000001',
            nome: 'Administrador',
            email: 'admin@desvio.com',
            senha: 'admin123',
            role: 'admin',
            ativo: true,
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          setUsers([defaultAdmin]);
        }

        const { data: questionsData } = await supabase
          .from('questions')
          .select('*');

        if (questionsData) {
          const mappedQuestions: Question[] = questionsData.map(q => ({
            id: q.id,
            materia: q.materia,
            assunto: q.assunto,
            enunciado: q.enunciado,
            alternativas: q.alternativas,
            indiceCorreto: q.indice_correto,
            explicacao: q.explicacao
          }));
          setQuestions(mappedQuestions);
        }

        const uniqueSubjects = [...new Set(questions.map(q => q.materia))];
        const allSubjects = [...new Set([...INITIAL_SUBJECTS, ...uniqueSubjects])];
        setSubjects(allSubjects as string[]);

        const savedErrorIds = localStorage.getItem('dp_error_notebook');
        if (savedErrorIds) setErrorNotebookIds(JSON.parse(savedErrorIds));

        const savedPerf = localStorage.getItem('dp_performance');
        if (savedPerf) setPerformance(JSON.parse(savedPerf));

        const savedComments = localStorage.getItem('dp_user_comments');
        if (savedComments) setUserComments(JSON.parse(savedComments));

      } catch (error) {
        console.error("Erro de Sincronização:", error);
        const fallbackRaw = localStorage.getItem('dp_questions');
        if (fallbackRaw) setQuestions(JSON.parse(fallbackRaw));
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const addQuestions = async (newQuestions: (Omit<Question, 'id'> & { id?: string })[]) => {
    const questionsToInsert = newQuestions.map(newQ => {
      const newId = newQ.id && !questions.some(q => q.id === newQ.id)
        ? newQ.id
        : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return {
        id: newId,
        materia: newQ.materia,
        assunto: newQ.assunto,
        enunciado: newQ.enunciado,
        alternativas: newQ.alternativas,
        indice_correto: newQ.indiceCorreto,
        explicacao: newQ.explicacao
      };
    });

    const { error } = await supabase
      .from('questions')
      .insert(questionsToInsert);

    if (error) {
      console.error('Erro ao inserir questões:', error);
      return;
    }

    const mappedQuestions: Question[] = newQuestions.map(newQ => {
      const newId = newQ.id && !questions.some(q => q.id === newQ.id)
        ? newQ.id
        : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return { ...newQ, id: newId } as Question;
    });

    setQuestions(prev => [...prev, ...mappedQuestions]);
  };

  const updateQuestion = async (updatedQuestion: Question) => {
    const { error } = await supabase
      .from('questions')
      .update({
        materia: updatedQuestion.materia,
        assunto: updatedQuestion.assunto,
        enunciado: updatedQuestion.enunciado,
        alternativas: updatedQuestion.alternativas,
        indice_correto: updatedQuestion.indiceCorreto,
        explicacao: updatedQuestion.explicacao
      })
      .eq('id', updatedQuestion.id);

    if (error) {
      console.error('Erro ao atualizar questão:', error);
      return;
    }

    setQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
  };

  const deleteQuestion = async (id: string) => {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar questão:', error);
      return;
    }

    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const addSubject = (name: string) => {
    if (subjects.includes(name)) return;
    const updated = [...subjects, name];
    setSubjects(updated);
  };

  const recordPerformance = async (record: PerformanceRecord) => {
    const updated = [...performance, record];
    setPerformance(updated);
    localStorage.setItem('dp_performance', JSON.stringify(updated));

    if (currentUser) {
      await supabase
        .from('performance')
        .insert({
          user_id: currentUser.id,
          question_id: record.questionId,
          materia: record.materia,
          assunto: record.assunto,
          is_correct: record.isCorrect
        });
    }
  };

  const saveUserComment = async (questionId: string, comment: string) => {
    const updated = { ...userComments, [questionId]: comment };
    if (!comment.trim()) delete updated[questionId];
    setUserComments(updated);
    localStorage.setItem('dp_user_comments', JSON.stringify(updated));

    if (currentUser) {
      const { data: existing } = await supabase
        .from('user_comments')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('question_id', questionId)
        .single();

      if (!comment.trim()) {
        await supabase
          .from('user_comments')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('question_id', questionId);
      } else if (existing) {
        await supabase
          .from('user_comments')
          .update({ comment })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('user_comments')
          .insert({
            user_id: currentUser.id,
            question_id: questionId,
            comment
          });
      }
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setView('admin');
    } else {
      setView('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('landing');
  };

  const handleRegisterUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (users.some(u => u.email === userData.email)) {
      alert('Este email já está cadastrado.');
      return;
    }

    const { data: inserted, error } = await supabase
      .from('users')
      .insert({
        nome: userData.nome,
        email: userData.email,
        senha: userData.senha,
        role: userData.role,
        ativo: userData.ativo
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar usuário:', error);
      alert('Erro ao criar conta. Tente novamente.');
      return;
    }

    const newUser: User = {
      id: inserted.id,
      nome: inserted.nome,
      email: inserted.email,
      senha: inserted.senha,
      role: inserted.role,
      ativo: inserted.ativo,
      createdAt: new Date(inserted.created_at).getTime(),
      updatedAt: new Date(inserted.updated_at).getTime()
    };
    
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setView('dashboard');
  };

  const handleAddUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data: inserted, error } = await supabase
      .from('users')
      .insert({
        nome: userData.nome,
        email: userData.email,
        senha: userData.senha,
        role: userData.role,
        ativo: userData.ativo
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar usuário:', error);
      return;
    }

    const newUser: User = {
      id: inserted.id,
      nome: inserted.nome,
      email: inserted.email,
      senha: inserted.senha,
      role: inserted.role,
      ativo: inserted.ativo,
      createdAt: new Date(inserted.created_at).getTime(),
      updatedAt: new Date(inserted.updated_at).getTime()
    };
    
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    const { error } = await supabase
      .from('users')
      .update({
        nome: updatedUser.nome,
        email: updatedUser.email,
        senha: updatedUser.senha,
        role: updatedUser.role,
        ativo: updatedUser.ativo
      })
      .eq('id', updatedUser.id);

    if (error) {
      console.error('Erro ao atualizar usuário:', error);
      return;
    }

    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Erro ao deletar usuário:', error);
      return;
    }

    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleSelectSubject = (subject: string, topic: string | null = null, filteredQuestions?: Question[]) => {
    setSelectedSubject(subject);
    setSelectedTopic(topic);
    if (filteredQuestions) {
      setSessionQuestions(filteredQuestions);
      setView('solver');
    } else {
      const baseQs = questions.filter(q => q.materia === subject && (!topic || q.assunto === topic));
      setSessionQuestions(baseQs);
      setView('solver');
    }
  };

  const handleStartSession = (qs: Question[], mode: View = 'simulado-active') => {
    setSessionQuestions(qs);
    setView(mode);
  };

  const toggleErrorNotebook = async (questionId: string) => {
    let updated = [...errorNotebookIds];
    if (updated.includes(questionId)) {
      updated = updated.filter(id => id !== questionId);
    } else {
      updated.push(questionId);
    }
    setErrorNotebookIds(updated);
    localStorage.setItem('dp_error_notebook', JSON.stringify(updated));

    if (currentUser) {
      if (updated.includes(questionId)) {
        await supabase
          .from('error_notebook')
          .insert({
            user_id: currentUser.id,
            question_id: questionId
          });
      } else {
        await supabase
          .from('error_notebook')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('question_id', questionId);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-legal-50">
        <div className="w-12 h-12 border-4 border-legal-200 border-t-legal-500 rounded-full animate-spin mb-4"></div>
        <p className="text-legal-800 font-serif-legal font-bold animate-pulse uppercase tracking-widest text-sm">Sincronizando Banco de Dados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {currentUser && view !== 'login' && view !== 'register' && (
        <Navbar 
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigate={(v) => setView(v)}
          currentView={view}
        />
      )}
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {view === 'landing' && (
          <Landing 
            onStart={() => setView('login')} 
          />
        )}
        
        {view === 'login' && (
          <Login 
            users={users}
            onLogin={handleLogin}
            onNavigateToRegister={() => setView('register')}
          />
        )}

        {view === 'register' && (
          <Register 
            onRegister={handleRegisterUser}
            onBackToLogin={() => setView('login')}
          />
        )}
        
        {view === 'dashboard' && (
          <Dashboard 
            subjects={subjects} 
            questions={questions}
            performance={performance}
            errorNotebookIds={errorNotebookIds}
            onSelectSubject={handleSelectSubject}
          />
        )}

        {(view === 'solver' || view === 'simulado-active' || view === 'notebook-session') && (
          <QuestionSolver 
            subject={selectedSubject || 'Sessão Especial'}
            topic={selectedTopic}
            isSimulado={view === 'simulado-active' || view === 'notebook-session'}
            questions={sessionQuestions}
            onBack={() => setView(view === 'simulado-active' || view === 'notebook-session' ? 'student-panel' : 'dashboard')}
            onToggleErrorNotebook={toggleErrorNotebook}
            onRecordPerformance={recordPerformance}
            errorNotebookIds={errorNotebookIds}
            performance={performance}
          />
        )}

        {view === 'admin' && currentUser?.role === 'admin' && (
          <AdminPanel 
            subjects={subjects}
            questions={questions}
            onAddSubject={addSubject}
            onAddQuestions={addQuestions}
            onUpdateQuestion={updateQuestion}
            onDeleteQuestion={deleteQuestion}
            onBack={() => setView('dashboard')} 
          />
        )}

        {view === 'admin' && currentUser?.role !== 'admin' && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
            <p className="text-legal-600 mb-6">Apenas administradores podem acessar o painel administrativo.</p>
            <button onClick={() => setView('dashboard')} className="bg-legal-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-legal-600">
              Voltar ao Dashboard
            </button>
          </div>
        )}

        {view === 'admin-users' && currentUser?.role === 'admin' && (
          <AdminUsers
            users={users}
            currentUser={currentUser}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onBack={() => setView('dashboard')}
          />
        )}

        {view === 'admin-users' && currentUser?.role !== 'admin' && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
            <p className="text-legal-600 mb-6">Apenas administradores podem gerenciar usuários.</p>
            <button onClick={() => setView('dashboard')} className="bg-legal-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-legal-600">
              Voltar ao Dashboard
            </button>
          </div>
        )}

        {view === 'student-panel' && (
          <StudentPanel 
            errorNotebookIds={errorNotebookIds} 
            allQuestions={questions}
            performance={performance}
            userComments={userComments}
            onSaveComment={saveUserComment}
            onBack={() => setView('dashboard')}
            onStartSession={handleStartSession}
          />
        )}
      </main>

      {view !== 'login' && view !== 'register' && (
        <footer className="bg-legal-900 text-legal-100 py-6 text-center text-sm no-print">
          <p>&copy; {new Date().getFullYear()} Desvio Padrão - Concursos Jurídicos. Todos os direitos reservados.</p>
        </footer>
      )}
    </div>
  );
};

export default App;
