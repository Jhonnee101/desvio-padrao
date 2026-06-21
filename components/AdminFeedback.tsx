import React, { useState } from 'react';
import { QuestionFeedback, FeedbackStatus, Question } from '../types';

interface AdminFeedbackProps {
  feedbacks: QuestionFeedback[];
  questions: Question[];
  onUpdateStatus: (id: string, status: FeedbackStatus) => Promise<void>;
  onEditQuestion: (id: string) => void;
  onDeleteQuestion: (id: string) => void;
  onBack: () => void;
}

const STATUS_CONFIG: Record<FeedbackStatus, { label: string, color: string, icon: string }> = {
  'pendente': { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
  'em_analise': { label: 'Em Análise', color: 'bg-blue-100 text-blue-700', icon: '🔍' },
  'concluida': { label: 'Concluída', color: 'bg-green-100 text-green-700', icon: '✅' }
};

const AdminFeedback: React.FC<AdminFeedbackProps> = ({ feedbacks, questions, onUpdateStatus, onEditQuestion, onDeleteQuestion, onBack }) => {
  const [filterStatus, setFilterStatus] = useState<FeedbackStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getQuestion = (qId: string) => questions.find(q => q.id === qId);

  const filteredFeedbacks = filterStatus === 'all'
    ? feedbacks
    : feedbacks.filter(f => f.status === filterStatus);

  const nextStatus = (current: FeedbackStatus): FeedbackStatus | null => {
    switch (current) {
      case 'pendente': return 'em_analise';
      case 'em_analise': return 'concluida';
      case 'concluida': return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-fadeIn">
      <header className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-legal-500 font-bold hover:underline flex items-center gap-1"
        >
          ← Voltar
        </button>
        <h2 className="text-2xl font-serif-legal font-bold text-legal-800">
          Feedback das Questões
        </h2>
        <div className="w-24" />
      </header>

      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-legal-200 items-center">
        <div className="flex gap-2 flex-wrap">
          {(['all', 'pendente', 'em_analise', 'concluida'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterStatus === status
                  ? status === 'all' ? 'bg-legal-500 text-white' : `${STATUS_CONFIG[status].color} ring-2 ring-offset-1 ring-legal-300`
                  : 'bg-legal-50 text-legal-600 hover:bg-legal-100'
              }`}
            >
              {status === 'all' ? '📋 Todos' : `${STATUS_CONFIG[status].icon} ${STATUS_CONFIG[status].label}`}
              {status === 'all'
                ? ` (${feedbacks.length})`
                : ` (${feedbacks.filter(f => f.status === status).length})`
              }
            </button>
          ))}
        </div>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="font-bold text-lg">Nenhum feedback encontrado</p>
          <p className="text-sm mt-1">Nenhum feedback com este status.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map(fb => {
            const question = getQuestion(fb.questionId);
            const isExpanded = expandedId === fb.id;
            const next = nextStatus(fb.status);

            return (
              <div
                key={fb.id}
                className="bg-white border border-legal-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[fb.status].color}`}>
                          {STATUS_CONFIG[fb.status].icon} {STATUS_CONFIG[fb.status].label}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(fb.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                        <span className="text-xs text-gray-400">
                          por {fb.userNome}
                        </span>
                      </div>

                      <p className="text-sm text-legal-800 whitespace-pre-wrap mb-3">
                        {fb.mensagem}
                      </p>

                      {question && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : fb.id)}
                          className="text-xs text-legal-500 hover:text-legal-700 font-medium flex items-center gap-1"
                        >
                          {isExpanded ? '▼ Esconder questão' : '▶ Ver questão referenciada'}
                        </button>
                      )}
                    </div>

                    <div className="flex gap-1 shrink-0">
                      {next && (
                        <button
                          onClick={() => onUpdateStatus(fb.id, next)}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-legal-500 text-white hover:bg-legal-600 transition-all"
                        >
                          {next === 'em_analise' ? '🔍 Em Análise' : '✅ Concluir'}
                        </button>
                      )}
                      {question && (
                        <>
                          <button
                            onClick={() => onEditQuestion(fb.questionId)}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-legal-500 text-white hover:bg-legal-600 transition-all"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => { if (confirm(`Tem certeza que deseja excluir a questão "${question.id}"? Esta ação afetará desempenhos e comentários vinculados.`)) onDeleteQuestion(fb.questionId); }}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
                          >
                            🗑️ Excluir
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {isExpanded && question && (
                    <div className="mt-4 p-4 bg-legal-50 rounded-xl border border-legal-100 animate-slideUp">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-legal-500 bg-legal-100 px-2 py-0.5 rounded">{question.materia}</span>
                        <span className="text-[10px] text-gray-400">{question.assunto}</span>
                      </div>
                      <p className="text-sm text-legal-800 whitespace-pre-wrap mb-3">{question.enunciado}</p>
                      <div className="space-y-1">
                        {question.alternativas.map((alt, i) => (
                          <div key={i} className={`text-xs p-2 rounded ${i === question.indiceCorreto ? 'bg-green-100 text-green-700 font-medium' : 'bg-white text-gray-600'}`}>
                            {String.fromCharCode(65 + i)}) {alt}
                            {i === question.indiceCorreto && ' ✓'}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
