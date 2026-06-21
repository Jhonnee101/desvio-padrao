import React, { useState, useEffect } from 'react';
import { View, Question, INITIAL_SUBJECTS, PerformanceRecord, User, UserRole, QuestionFeedback, FeedbackStatus, QuestionComment } from './types';
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
import AdminFeedback from './components/AdminFeedback';

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
  const [feedbacks, setFeedbacks] = useState<QuestionFeedback[]>([]);
  const [editQuestionId, setEditQuestionId] = useState<string | null>(null);
  const [commentsCache, setCommentsCache] = useState<Record<string, QuestionComment[]>>({});

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);

        const { data: questionsData } = await supabase
          .from('questions')
          .select('*')
          .order('created_at', { ascending: false });

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

          const uniqueSubjects = [...new Set(mappedQuestions.map(q => q.materia))];
          const allSubjects = [...new Set([...INITIAL_SUBJECTS, ...uniqueSubjects])];
          setSubjects(allSubjects as string[]);
        }

        const savedSession = localStorage.getItem('dp_session');
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          const { data: userData } = await supabase
            .from('users')
            .select('id, nome, email, role, ativo, created_at, updated_at')
            .eq('id', parsed.id)
            .single();

          if (userData && userData.ativo) {
            const restoredUser: User = {
              id: userData.id,
              nome: userData.nome,
              email: userData.email,
              senha: '',
              role: userData.role as UserRole,
              ativo: userData.ativo,
              createdAt: new Date(userData.created_at).getTime(),
              updatedAt: new Date(userData.updated_at).getTime()
            };
            setCurrentUser(restoredUser);
            await loadUserData(restoredUser.id);
          } else {
            localStorage.removeItem('dp_session');
          }
        }
      } catch (error) {
        console.error("Erro de Sincronização:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      const { data: perfData } = await supabase
        .from('performance')
        .select('*')
        .eq('user_id', userId);

      if (perfData) {
        const mappedPerf: PerformanceRecord[] = perfData.map(p => ({
          questionId: p.question_id,
          materia: p.materia,
          assunto: p.assunto,
          isCorrect: p.is_correct,
          timestamp: new Date(p.answered_at).getTime()
        }));
        setPerformance(mappedPerf);
      }

      const { data: notebookData } = await supabase
        .from('error_notebook')
        .select('question_id')
        .eq('user_id', userId);

      if (notebookData) {
        setErrorNotebookIds(notebookData.map(n => n.question_id));
      }

      const { data: commentsData } = await supabase
        .from('user_comments')
        .select('question_id, comment')
        .eq('user_id', userId);

      if (commentsData) {
        const commentsMap: Record<string, string> = {};
        commentsData.forEach(c => {
          commentsMap[c.question_id] = c.comment;
        });
        setUserComments(commentsMap);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  const loadFeedbacks = async () => {
    try {
      const { data } = await supabase
        .from('question_feedback')
        .select('*, users(nome)')
        .order('created_at', { ascending: false });

      if (data) {
        const mapped: QuestionFeedback[] = data.map(f => ({
          id: f.id,
          userId: f.user_id,
          userNome: (f.users as { nome: string } | null)?.nome || 'Desconhecido',
          questionId: f.question_id,
          mensagem: f.mensagem,
          status: f.status as FeedbackStatus,
          createdAt: new Date(f.created_at).getTime(),
          updatedAt: new Date(f.updated_at).getTime()
        }));
        setFeedbacks(mapped);
      }
    } catch (error) {
      console.error('Erro ao carregar feedbacks:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const { data: usersData } = await supabase
        .from('users')
        .select('id, nome, email, role, ativo, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (usersData) {
        const mappedUsers: User[] = usersData.map(u => ({
          id: u.id,
          nome: u.nome,
          email: u.email,
          senha: '',
          role: u.role as UserRole,
          ativo: u.ativo,
          createdAt: new Date(u.created_at).getTime(),
          updatedAt: new Date(u.updated_at).getTime()
        }));
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

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
      alert(`Erro ao inserir questões: ${error.message}`);
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
    setSubjects(prev => [...prev, name]);
  };

  const recordPerformance = async (record: PerformanceRecord) => {
    const updated = [...performance, record];
    setPerformance(updated);

    if (currentUser) {
      const { error } = await supabase
        .from('performance')
        .insert({
          user_id: currentUser.id,
          question_id: record.questionId,
          materia: record.materia,
          assunto: record.assunto,
          is_correct: record.isCorrect
        });

      if (error) {
        console.error('Erro ao salvar performance no servidor:', error);
        localStorage.setItem('dp_performance', JSON.stringify(updated));
      }
    }
  };

  const saveUserComment = async (questionId: string, comment: string) => {
    const updated = { ...userComments, [questionId]: comment };
    if (!comment.trim()) delete updated[questionId];
    setUserComments(updated);

    if (currentUser) {
      if (!comment.trim()) {
        await supabase
          .from('user_comments')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('question_id', questionId);
      } else {
        const { data: existing } = await supabase
          .from('user_comments')
          .select('id')
          .eq('user_id', currentUser.id)
          .eq('question_id', questionId)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('user_comments')
            .update({ comment, updated_at: new Date().toISOString() })
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
    }
  };

  const loadComments = async (questionId: string): Promise<QuestionComment[]> => {
    if (commentsCache[questionId]) return commentsCache[questionId];
    try {
      const { data: commentsData } = await supabase
        .from('question_comments')
        .select('*, users!inner(nome)')
        .eq('question_id', questionId)
        .order('created_at', { ascending: true });

      if (!commentsData) return [];

      let userVotes: Record<string, 'like' | 'dislike'> = {};
      if (currentUser) {
        const { data: votesData } = await supabase
          .from('comment_votes')
          .select('comment_id, vote_type')
          .eq('user_id', currentUser.id);

        if (votesData) {
          votesData.forEach(v => { userVotes[v.comment_id] = v.vote_type as 'like' | 'dislike'; });
        }
      }

      const { data: likesData } = await supabase
        .from('comment_votes')
        .select('comment_id, vote_type');

      const likeCount: Record<string, { likes: number; dislikes: number }> = {};
      if (likesData) {
        likesData.forEach(v => {
          if (!likeCount[v.comment_id]) likeCount[v.comment_id] = { likes: 0, dislikes: 0 };
          if (v.vote_type === 'like') likeCount[v.comment_id].likes++;
          else likeCount[v.comment_id].dislikes++;
        });
      }

      const commentsMap: Record<string, QuestionComment> = {};
      const rootComments: QuestionComment[] = [];

      commentsData.forEach(c => {
        const comment: QuestionComment = {
          id: c.id,
          userId: c.user_id,
          userNome: (c.users as { nome: string } | null)?.nome || 'Desconhecido',
          questionId: c.question_id,
          parentId: c.parent_id,
          content: c.content,
          createdAt: new Date(c.created_at).getTime(),
          updatedAt: new Date(c.updated_at).getTime(),
          likes: likeCount[c.id]?.likes || 0,
          dislikes: likeCount[c.id]?.dislikes || 0,
          userVote: userVotes[c.id] || null,
          replies: []
        };
        commentsMap[c.id] = comment;
      });

      commentsData.forEach(c => {
        const comment = commentsMap[c.id];
        if (c.parent_id && commentsMap[c.parent_id]) {
          commentsMap[c.parent_id].replies.push(comment);
        } else if (!c.parent_id) {
          rootComments.push(comment);
        }
      });

      const sortByLikes = (a: QuestionComment, b: QuestionComment) => b.likes - a.likes;
      rootComments.sort(sortByLikes);
      rootComments.forEach(r => r.replies.sort(sortByLikes));

      setCommentsCache(prev => ({ ...prev, [questionId]: rootComments }));
      return rootComments;
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
      return [];
    }
  };

  const addComment = async (questionId: string, content: string, parentId: string | null = null): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const { error } = await supabase
        .from('question_comments')
        .insert({
          user_id: currentUser.id,
          question_id: questionId,
          parent_id: parentId,
          content
        });

      if (error) {
        console.error('Erro ao adicionar comentário:', error);
        return false;
      }

      setCommentsCache(prev => ({ ...prev, [questionId]: [] }));
      await loadComments(questionId);
      return true;
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      return false;
    }
  };

  const deleteComment = async (commentId: string, questionId: string): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const { error } = await supabase
        .from('question_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', currentUser.id);

      if (error) {
        console.error('Erro ao deletar comentário:', error);
        return false;
      }

      setCommentsCache(prev => ({ ...prev, [questionId]: [] }));
      await loadComments(questionId);
      return true;
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      return false;
    }
  };

  const voteComment = async (commentId: string, voteType: 'like' | 'dislike', questionId: string): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const { data: existing } = await supabase
        .from('comment_votes')
        .select('id, vote_type')
        .eq('user_id', currentUser.id)
        .eq('comment_id', commentId)
        .maybeSingle();

      if (existing) {
        if (existing.vote_type === voteType) {
          await supabase
            .from('comment_votes')
            .delete()
            .eq('id', existing.id);
        } else {
          await supabase
            .from('comment_votes')
            .update({ vote_type: voteType })
            .eq('id', existing.id);
        }
      } else {
        await supabase
          .from('comment_votes')
          .insert({
            user_id: currentUser.id,
            comment_id: commentId,
            vote_type: voteType
          });
      }

      setCommentsCache(prev => ({ ...prev, [questionId]: [] }));
      await loadComments(questionId);
      return true;
    } catch (error) {
      console.error('Erro ao votar no comentário:', error);
      return false;
    }
  };

  const submitFeedback = async (questionId: string, mensagem: string) => {
    if (!currentUser) return;

    const { error } = await supabase
      .from('question_feedback')
      .insert({
        user_id: currentUser.id,
        question_id: questionId,
        mensagem,
        status: 'pendente'
      });

    if (error) {
      console.error('Erro ao enviar feedback:', error);
      throw new Error('Erro ao enviar feedback.');
    }

    await loadFeedbacks();
  };

  const updateFeedbackStatus = async (id: string, status: FeedbackStatus) => {
    const { error } = await supabase
      .from('question_feedback')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar feedback:', error);
      return;
    }

    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status, updatedAt: Date.now() } : f));
  };

  const handleEditQuestionFromFeedback = (questionId: string) => {
    setEditQuestionId(questionId);
    setView('admin');
  };

  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.rpc('login_user', {
      p_email: email,
      p_senha: password
    });

    if (error) {
      console.error('Erro completo do RPC:', error);
      throw new Error(`Erro no login: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('Email ou senha inválidos.');
    }

    const userData = data[0];
    const user: User = {
      id: userData.id,
      nome: userData.nome,
      email: userData.email,
      senha: '',
      role: userData.role as UserRole,
      ativo: userData.ativo,
      createdAt: new Date(userData.created_at).getTime(),
      updatedAt: new Date(userData.updated_at).getTime()
    };

    setCurrentUser(user);
    localStorage.setItem('dp_session', JSON.stringify({ id: user.id, nome: user.nome, email: user.email }));
    await loadUserData(user.id);

    if (user.role === 'admin') {
      setView('admin');
    } else {
      setView('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPerformance([]);
    setErrorNotebookIds([]);
    setUserComments({});
    setUsers([]);
    setFeedbacks([]);
    setCommentsCache({});
    localStorage.removeItem('dp_session');
    setView('landing');
  };

  const handleRegisterUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase.rpc('register_user', {
      p_nome: userData.nome,
      p_email: userData.email,
      p_senha: userData.senha,
      p_role: userData.role,
      p_ativo: false
    });

    if (error) {
      if (error.message?.includes('duplicate key') || error.message?.includes('already exists')) {
        throw new Error('Este email já está cadastrado.');
      }
      throw new Error(error.message || 'Erro ao criar conta.');
    }
  };

  const handleAddUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase.rpc('create_user', {
      p_nome: userData.nome,
      p_email: userData.email,
      p_senha: userData.senha,
      p_role: userData.role,
      p_ativo: userData.ativo
    });

    if (error) {
      throw new Error(error.message || 'Erro ao criar usuário.');
    }

    const inserted = data[0];
    const newUser: User = {
      id: inserted.id,
      nome: inserted.nome,
      email: inserted.email,
      senha: '',
      role: inserted.role as UserRole,
      ativo: inserted.ativo,
      createdAt: new Date(inserted.created_at).getTime(),
      updatedAt: new Date(inserted.updated_at).getTime()
    };

    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    const { data, error } = await supabase.rpc('update_user', {
      p_id: updatedUser.id,
      p_nome: updatedUser.nome,
      p_email: updatedUser.email,
      p_senha: updatedUser.senha || null,
      p_role: updatedUser.role,
      p_ativo: updatedUser.ativo
    });

    if (error) {
      throw new Error(error.message || 'Erro ao atualizar usuário.');
    }

    const updated = data[0];
    const mappedUser: User = {
      id: updated.id,
      nome: updated.nome,
      email: updated.email,
      senha: '',
      role: updated.role as UserRole,
      ativo: updated.ativo,
      createdAt: new Date(updated.created_at).getTime(),
      updatedAt: new Date(updated.updated_at).getTime()
    };

    setUsers(prev => prev.map(u => u.id === mappedUser.id ? mappedUser : u));

    if (currentUser?.id === mappedUser.id) {
      setCurrentUser(mappedUser);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const { error } = await supabase.rpc('delete_user', {
      p_id: userId
    });

    if (error) {
      throw new Error(error.message || 'Erro ao deletar usuário.');
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
        <p className="text-legal-800 font-serif-legal font-bold animate-pulse uppercase tracking-widest text-sm">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {currentUser && view !== 'login' && view !== 'register' && (
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigate={(v) => {
            setEditQuestionId(null);
            if (v === 'admin-users') loadUsers();
            if (v === 'admin-feedback') loadFeedbacks();
            setView(v);
          }}
          currentView={view}
        />
      )}

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {view === 'landing' && <Landing onStart={() => setView('login')} />}

        {view === 'login' && (
          <Login onLogin={handleLogin} onNavigateToRegister={() => setView('register')} />
        )}

        {view === 'register' && (
          <Register onRegister={handleRegisterUser} onBackToLogin={() => setView('login')} />
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
            currentUser={currentUser}
            onSubmitFeedback={submitFeedback}
            onLoadComments={loadComments}
            onAddComment={addComment}
            onDeleteComment={deleteComment}
            onVoteComment={voteComment}
          />
        )}

        {view === 'admin' && (
          currentUser?.role === 'admin' ? (
            <AdminPanel
              subjects={subjects}
              questions={questions}
              onAddSubject={addSubject}
              onAddQuestions={addQuestions}
              onUpdateQuestion={updateQuestion}
              onDeleteQuestion={deleteQuestion}
              onBack={() => { setEditQuestionId(null); setView('dashboard'); }}
              editQuestionId={editQuestionId}
            />
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
              <p className="text-legal-600 mb-6">Apenas administradores podem acessar o painel administrativo.</p>
              <button onClick={() => setView('dashboard')} className="bg-legal-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-legal-600">
                Voltar ao Dashboard
              </button>
            </div>
          )
        )}

        {view === 'admin-users' && (
          currentUser?.role === 'admin' ? (
            <AdminUsers
              users={users}
              currentUser={currentUser}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onBack={() => setView('dashboard')}
            />
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
              <p className="text-legal-600 mb-6">Apenas administradores podem gerenciar usuários.</p>
              <button onClick={() => setView('dashboard')} className="bg-legal-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-legal-600">
                Voltar ao Dashboard
              </button>
            </div>
          )
        )}

        {view === 'admin-feedback' && (
          currentUser?.role === 'admin' || currentUser?.role === 'collaborator' ? (
            <AdminFeedback
              feedbacks={feedbacks}
              questions={questions}
              onUpdateStatus={updateFeedbackStatus}
              onEditQuestion={handleEditQuestionFromFeedback}
              onBack={() => setView('dashboard')}
            />
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
              <p className="text-legal-600 mb-6">Apenas administradores e colaboradores podem acessar esta página.</p>
              <button onClick={() => setView('dashboard')} className="bg-legal-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-legal-600">
                Voltar ao Dashboard
              </button>
            </div>
          )
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
