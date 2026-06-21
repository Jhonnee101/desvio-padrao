
import React, { useState, useEffect, useMemo } from 'react';
import { Question, PerformanceRecord, User, QuestionComment } from '../types';
import CommentsSection from './CommentsSection';

interface QuestionSolverProps {
  subject: string;
  topic: string | null;
  questions: Question[];
  onBack: () => void;
  onToggleErrorNotebook: (id: string) => void;
  onRecordPerformance: (record: PerformanceRecord) => void;
  errorNotebookIds: string[];
  performance: PerformanceRecord[];
  isSimulado?: boolean;
  currentUser?: User | null;
  onSubmitFeedback?: (questionId: string, mensagem: string) => Promise<void>;
  onLoadComments?: (questionId: string) => Promise<QuestionComment[]>;
  onAddComment?: (questionId: string, content: string, parentId: string | null) => Promise<boolean>;
  onDeleteComment?: (commentId: string, questionId: string) => Promise<boolean>;
  onVoteComment?: (commentId: string, voteType: 'like' | 'dislike', questionId: string) => Promise<boolean>;
}

const QuestionSolver: React.FC<QuestionSolverProps> = ({ subject, topic, questions, onBack, onToggleErrorNotebook, onRecordPerformance, errorNotebookIds, performance, isSimulado, currentUser, onSubmitFeedback, onLoadComments, onAddComment, onDeleteComment, onVoteComment }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [responses, setResponses] = useState<Record<string, { selected: number | null, discarded: number[], answered: boolean }>>({});
  const [feedbackOpen, setFeedbackOpen] = useState<Record<string, boolean>>({});
  const [feedbackText, setFeedbackText] = useState<Record<string, string>>({});
  const [feedbackSent, setFeedbackSent] = useState<Record<string, boolean>>({});
  const [feedbackLoading, setFeedbackLoading] = useState<Record<string, boolean>>({});
  const [commentsOpen, setCommentsOpen] = useState<Record<string, boolean>>({});
  
  const [isFinalized, setIsFinalized] = useState(false);
  const [isReviewingErrors, setIsReviewingErrors] = useState(false);

  const questionsPerPage = 10;

  const filteredQuestions = useMemo(() => {
    if (!isReviewingErrors) return questions;
    return questions.filter(q => {
      const resp = responses[q.id];
      return resp?.selected !== null && resp.selected !== q.indiceCorreto;
    });
  }, [questions, isReviewingErrors, responses]);

  const currentQuestions = filteredQuestions.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage);
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  useEffect(() => {
    const newResponses = { ...responses };
    let changed = false;
    currentQuestions.forEach(q => {
      if (!newResponses[q.id]) {
        newResponses[q.id] = { selected: null, discarded: [], answered: false };
        changed = true;
      }
    });
    if (changed) setResponses(newResponses);
  }, [currentPage, filteredQuestions]);

  const handleDiscard = (qId: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const qState = responses[qId];
    if (qState?.answered && !isSimulado) return;
    if (isFinalized && isSimulado) return;

    const newDiscarded = qState.discarded.includes(idx)
      ? qState.discarded.filter(i => i !== idx)
      : [...qState.discarded, idx];

    setResponses({
      ...responses,
      [qId]: { ...qState, discarded: newDiscarded, selected: qState.selected === idx ? null : qState.selected }
    });
  };

  const handleSelect = (qId: string, idx: number) => {
    const qState = responses[qId];
    if ((qState?.answered && !isSimulado) || isFinalized || qState?.discarded.includes(idx)) return;
    setResponses({
      ...responses,
      [qId]: { ...qState, selected: idx }
    });
  };

  const handleAnswer = (qId: string) => {
    const qState = responses[qId];
    const qData = questions.find(q => q.id === qId);
    if (qState?.selected !== null && qData) {
      setResponses({
        ...responses,
        [qId]: { ...qState, answered: true }
      });
      onRecordPerformance({
        questionId: qId,
        materia: qData.materia,
        assunto: qData.assunto,
        isCorrect: qState.selected === qData.indiceCorreto,
        timestamp: Date.now()
      });
    }
  };

  const handleFinalizeSimulado = () => {
    const unanswered = questions.some(q => responses[q.id]?.selected === null);
    if (unanswered && !confirm("Você ainda tem questões sem resposta. Deseja finalizar assim mesmo?")) {
      return;
    }

    questions.forEach(q => {
      const resp = responses[q.id];
      if (resp?.selected !== null) {
        onRecordPerformance({
          questionId: q.id,
          materia: q.materia,
          assunto: q.assunto,
          isCorrect: resp.selected === q.indiceCorreto,
          timestamp: Date.now()
        });
      }
    });

    setIsFinalized(true);
    setCurrentPage(0);
  };

  const stats = useMemo(() => {
    if (!isSimulado || !isFinalized) return null;
    let correct = 0;
    let answeredCount = 0;
    questions.forEach(q => {
      const resp = responses[q.id];
      if (resp?.selected !== null) {
        answeredCount++;
        if (resp.selected === q.indiceCorreto) correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      wrong: answeredCount - correct,
      percent: (correct / questions.length) * 100
    };
  }, [isFinalized, isSimulado, questions, responses]);

  const BackButton = () => (
    <button onClick={onBack} className="flex items-center text-gray-400 hover:text-legal-500 transition-colors gap-1 group">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
      </svg>
      {isSimulado ? 'Sair da Sessão' : 'Voltar para Matérias'}
    </button>
  );

  const getPreviousStatus = (questionId: string) => {
    const records = performance.filter(p => p.questionId === questionId);
    if (records.length === 0) return null;
    return records[records.length - 1].isCorrect;
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-8 animate-fadeIn">
      <header className="flex items-center justify-between sticky top-16 bg-legal-50/95 backdrop-blur-sm z-30 py-4 border-b border-legal-100 mb-4">
        <BackButton />
        <div className="text-right">
          <h2 className="text-lg font-serif-legal font-bold text-legal-900 leading-tight">
            {isSimulado ? (isReviewingErrors ? 'Revisão de Erros' : 'Sessão Especial') : subject}
          </h2>
          <div className="text-[10px] font-bold text-legal-400 uppercase tracking-widest">
            {isReviewingErrors ? 'Apenas questões incorretas' : (topic || 'Todas as questões')}
          </div>
          <div className="text-[10px] font-bold text-legal-500 mt-1">
            Página {currentPage + 1} de {totalPages} ({filteredQuestions.length} questões)
          </div>
        </div>
      </header>

      <div className="space-y-12">
        {currentQuestions.map((q, qIdx) => {
          const qState = responses[q.id] || { selected: null, discarded: [], answered: false };
          // O feedback (resposta e explicação) só aparece se:
          // 1. A questão foi respondida nesta sessão (qState.answered)
          // 2. Ou se estamos revisando erros após finalizar um simulado
          // 3. Ou se o simulado já foi finalizado
          const shouldShowFeedback = qState.answered || isReviewingErrors || (isSimulado && isFinalized);
          const isInNotebook = errorNotebookIds.includes(q.id);
          const previousCorrect = getPreviousStatus(q.id);

          return (
            <div key={q.id} className="bg-white rounded-2xl border border-legal-200 shadow-sm p-8 space-y-8 scroll-mt-24" id={`q-${q.id}`}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="bg-legal-50 px-3 py-1 rounded text-[10px] font-bold text-legal-600 uppercase">
                    Questão {(currentPage * questionsPerPage) + qIdx + 1} • {q.materia}
                  </div>
                  
                  {/* Selos de Resolução Anterior - Conforme solicitado (sem mostrar a resposta) */}
                  {previousCorrect !== null && (
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 text-[12px] font-bold transition-all shadow-sm ${
                      previousCorrect 
                        ? 'border-emerald-500 text-emerald-500 bg-white' 
                        : 'border-red-500 text-red-500 bg-white'
                    }`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                        previousCorrect ? 'border-emerald-500' : 'border-red-500'
                      }`}>
                        {previousCorrect ? (
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      {previousCorrect ? 'Resolvi certo!' : 'Resolvi errado!'}
                    </div>
                  )}
                </div>
                <div className="text-[11px] font-semibold text-legal-400 uppercase tracking-tight">{q.assunto}</div>
                <p className="text-xl font-medium leading-relaxed text-gray-800 whitespace-pre-wrap">
                  {q.enunciado}
                </p>
              </div>

              <div className="space-y-3">
                {q.alternativas.map((alt, idx) => {
                  const isSelected = qState.selected === idx;
                  const isDiscarded = qState.discarded.includes(idx);
                  const isCorrect = shouldShowFeedback && idx === q.indiceCorreto;
                  const isWrong = shouldShowFeedback && isSelected && idx !== q.indiceCorreto;
                  
                  let bgClass = "bg-white border-gray-100 hover:border-legal-200";
                  if (isSelected) bgClass = "bg-legal-50 border-legal-500 shadow-inner";
                  if (isDiscarded) bgClass = "bg-gray-50 border-gray-100 opacity-60";
                  if (isCorrect) bgClass = "bg-green-50 border-green-500 ring-1 ring-green-500";
                  if (isWrong) bgClass = "bg-red-50 border-red-500 ring-1 ring-red-500";

                  return (
                    <div 
                      key={idx}
                      onClick={() => handleSelect(q.id, idx)}
                      className={`relative flex items-center p-5 rounded-xl border-2 transition-all cursor-pointer group ${bgClass}`}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs mr-4 shrink-0 ${isSelected ? 'bg-legal-500 text-white' : 'bg-legal-100 text-legal-700'}`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div className={`flex-grow text-gray-700 leading-snug ${isDiscarded ? 'line-through text-red-600/40 decoration-2' : ''}`}>
                        {alt}
                      </div>
                      <button 
                        onClick={(e) => handleDiscard(q.id, idx, e)}
                        title="descartar"
                        className={`ml-4 p-2 rounded-full transition-all ${isDiscarded ? 'bg-red-500 text-white rotate-90' : 'text-red-100 hover:bg-red-50 hover:text-red-500'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>

              {shouldShowFeedback && (
                <div className="animate-fadeIn p-6 bg-legal-50 rounded-xl border border-legal-200 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-legal-800 flex items-center">
                      <span className="mr-2">💡</span> Justificativa
                    </h4>
                    <button 
                      onClick={() => onToggleErrorNotebook(q.id)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all border shadow-sm flex items-center gap-1 ${isInNotebook ? 'bg-red-500 text-white border-red-600' : 'bg-white text-legal-500 hover:bg-legal-100 border-legal-200'}`}
                    >
                      {isInNotebook ? '✓ Salvo no Caderno' : '+ Incluir no Caderno de Erros'}
                    </button>
                  </div>
                  <p className="text-gray-700 italic leading-relaxed whitespace-pre-line text-sm">
                    {q.explicacao}
                  </p>
                </div>
              )}

              {!shouldShowFeedback && (
                 <div className="flex justify-end pt-4 border-t border-legal-50">
                  <button 
                    disabled={qState.selected === null}
                    onClick={() => handleAnswer(q.id)}
                    className="bg-legal-500 hover:bg-legal-600 disabled:bg-gray-200 text-white px-10 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95"
                  >
                    Responder
                  </button>
                </div>
              )}

              {currentUser && (
                <div className="pt-4 border-t border-legal-50">
                  {!feedbackOpen[q.id] && !feedbackSent[q.id] && (
                    <button
                      onClick={() => setFeedbackOpen(prev => ({ ...prev, [q.id]: true }))}
                      className="text-xs text-gray-400 hover:text-legal-500 font-medium transition-colors flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clipRule="evenodd" />
                      </svg>
                      Reportar erro / Deixar feedback
                    </button>
                  )}

                  {feedbackOpen[q.id] && (
                    <div className="animate-fadeIn space-y-3">
                      <textarea
                        className="w-full border border-legal-200 rounded-xl p-3 text-sm outline-none focus:border-legal-500 resize-none bg-legal-50/20"
                        rows={3}
                        placeholder="Descreva o erro ou sugestão para esta questão..."
                        value={feedbackText[q.id] || ''}
                        onChange={e => setFeedbackText(prev => ({ ...prev, [q.id]: e.target.value }))}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            const msg = feedbackText[q.id]?.trim();
                            if (!msg || !onSubmitFeedback) return;
                            setFeedbackLoading(prev => ({ ...prev, [q.id]: true }));
                            try {
                              await onSubmitFeedback(q.id, msg);
                              setFeedbackSent(prev => ({ ...prev, [q.id]: true }));
                              setFeedbackOpen(prev => ({ ...prev, [q.id]: false }));
                              setFeedbackText(prev => ({ ...prev, [q.id]: '' }));
                            } catch (err) {
                              console.error('Erro ao enviar feedback:', err);
                            } finally {
                              setFeedbackLoading(prev => ({ ...prev, [q.id]: false }));
                            }
                          }}
                          disabled={!feedbackText[q.id]?.trim() || feedbackLoading[q.id]}
                          className="bg-legal-500 hover:bg-legal-600 disabled:bg-gray-200 text-white px-6 py-2 rounded-xl font-bold text-xs transition-all"
                        >
                          {feedbackLoading[q.id] ? 'Enviando...' : 'Enviar Feedback'}
                        </button>
                        <button
                          onClick={() => {
                            setFeedbackOpen(prev => ({ ...prev, [q.id]: false }));
                            setFeedbackText(prev => ({ ...prev, [q.id]: '' }));
                          }}
                          className="border border-legal-200 text-legal-600 px-4 py-2 rounded-xl font-bold text-xs hover:bg-legal-50 transition-all"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {feedbackSent[q.id] && (
                    <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Feedback enviado! Obrigado por contribuir.
                    </div>
                  )}
                </div>
              )}

              {!isSimulado && onLoadComments && onAddComment && onDeleteComment && onVoteComment && (
                <div className="pt-4 border-t border-legal-50">
                  {!commentsOpen[q.id] ? (
                    <button
                      onClick={() => setCommentsOpen(prev => ({ ...prev, [q.id]: true }))}
                      className="flex items-center gap-2 text-xs text-gray-400 hover:text-legal-600 font-medium transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clipRule="evenodd" />
                      </svg>
                      Comentários
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={() => setCommentsOpen(prev => ({ ...prev, [q.id]: false }))}
                        className="flex items-center gap-2 text-xs text-gray-400 hover:text-legal-600 font-medium transition-colors mb-3"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Fechar comentários
                      </button>
                      <CommentsSection
                        questionId={q.id}
                        currentUser={currentUser || null}
                        onLoadComments={onLoadComments}
                        onAddComment={onAddComment}
                        onDeleteComment={onDeleteComment}
                        onVoteComment={onVoteComment}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-6 py-12">
        <div className="flex items-center gap-6">
          <button 
            disabled={currentPage === 0}
            onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo(0,0); }}
            className="bg-white border border-legal-300 text-legal-700 px-6 py-2 rounded-xl font-bold disabled:opacity-30 hover:bg-legal-50 transition-all shadow-sm"
          >
            ← Página Anterior
          </button>
          <span className="text-sm font-bold text-legal-500">Página {currentPage + 1} de {totalPages}</span>
          <button 
            disabled={currentPage === totalPages - 1}
            onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo(0,0); }}
            className="bg-legal-900 text-white px-6 py-2 rounded-xl font-bold disabled:opacity-30 hover:bg-black transition-all shadow-md"
          >
            Próxima Página →
          </button>
        </div>

        {isSimulado && !isFinalized && !isReviewingErrors && (
          <button 
            onClick={handleFinalizeSimulado}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-12 py-4 rounded-2xl font-bold text-xl transition-all shadow-xl scale-105 active:scale-100"
          >
            Finalizar Sessão
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionSolver;
