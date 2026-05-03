
import React, { useState, useMemo } from 'react';
import { SUBJECT_TOPICS, PerformanceRecord } from '../types';

interface DashboardProps {
  subjects: string[];
  questions: any[];
  performance: PerformanceRecord[];
  errorNotebookIds: string[];
  onSelectSubject: (subject: string, topic: string | null, filteredQuestions: any[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ subjects, questions, performance, errorNotebookIds, onSelectSubject }) => {
  const [drilledSubject, setDrilledSubject] = useState<string | null>(null);
  const [hideSolved, setHideSolved] = useState(false);
  const [hideInNotebook, setHideInNotebook] = useState(false);

  const solvedIds = useMemo(() => new Set(performance.map(p => p.questionId)), [performance]);
  const notebookIdsSet = useMemo(() => new Set(errorNotebookIds), [errorNotebookIds]);

  const applyFilters = (qs: any[]) => {
    return qs.filter(q => {
      if (hideSolved && solvedIds.has(q.id)) return false;
      if (hideInNotebook && notebookIdsSet.has(q.id)) return false;
      return true;
    });
  };

  const BackButton = ({ label = "Voltar para Matérias", onClick }: { label?: string, onClick?: () => void }) => (
    <button 
      onClick={onClick!} 
      className="text-legal-500 font-bold hover:underline flex items-center gap-1 transition-all hover:gap-2 mb-4 group"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
      </svg>
      {label}
    </button>
  );

  const FilterBar = () => (
    <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-legal-100 shadow-sm mb-8 items-center">
      <span className="text-xs font-bold text-legal-400 uppercase tracking-widest mr-2">Filtros de Exclusão:</span>
      <label className="flex items-center gap-2 cursor-pointer group">
        <input 
          type="checkbox" 
          checked={hideSolved} 
          onChange={() => setHideSolved(!hideSolved)}
          className="w-4 h-4 accent-legal-500"
        />
        <span className={`text-xs font-semibold ${hideSolved ? 'text-legal-900' : 'text-gray-400'}`}>Ocultar Resolvidas</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer group">
        <input 
          type="checkbox" 
          checked={hideInNotebook} 
          onChange={() => setHideInNotebook(!hideInNotebook)}
          className="w-4 h-4 accent-legal-500"
        />
        <span className={`text-xs font-semibold ${hideInNotebook ? 'text-legal-900' : 'text-gray-400'}`}>Ocultar do Caderno</span>
      </label>
    </div>
  );

  const handleSubjectClick = (subject: string) => {
    if (SUBJECT_TOPICS[subject]) {
      setDrilledSubject(subject);
    } else {
      const subQuestions = questions.filter(q => q.materia === subject);
      onSelectSubject(subject, null, applyFilters(subQuestions));
    }
  };

  if (drilledSubject) {
    const topics = SUBJECT_TOPICS[drilledSubject];
    return (
      <div className="space-y-8 animate-fadeIn pb-12">
        <header className="flex flex-col gap-2">
          <BackButton label="Voltar para Matérias" onClick={() => setDrilledSubject(null)} />
          <div>
            <h2 className="text-3xl font-serif-legal font-bold text-legal-900">{drilledSubject}</h2>
            <p className="text-gray-500">Selecione um assunto específico.</p>
          </div>
        </header>

        <FilterBar />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => {
              const qs = questions.filter(q => q.materia === drilledSubject);
              onSelectSubject(drilledSubject, null, applyFilters(qs));
            }}
            className="p-6 text-left rounded-xl border-2 border-legal-500 bg-legal-50 text-legal-900 font-bold hover:bg-legal-100 transition-all flex items-center justify-between group shadow-sm"
          >
            <span>🚀 Ver todas as questões filtradas</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
          
          {topics.map((topic, idx) => {
            const rawQuestions = questions.filter(q => q.materia === drilledSubject && q.assunto === topic);
            const filteredCount = applyFilters(rawQuestions).length;
            
            return (
              <button 
                key={idx}
                disabled={filteredCount === 0}
                onClick={() => onSelectSubject(drilledSubject, topic, applyFilters(rawQuestions))}
                className={`p-4 text-left rounded-xl border transition-all flex items-center justify-between ${
                  filteredCount === 0 
                  ? 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed' 
                  : 'bg-white border-legal-100 hover:border-legal-300 hover:shadow-md'
                }`}
              >
                <div className="flex-grow pr-4">
                  <div className="text-sm font-bold text-legal-900 leading-tight">{topic}</div>
                  <div className="text-[10px] uppercase font-bold text-legal-500 mt-1">{filteredCount} questões disponíveis</div>
                </div>
                <span className="text-legal-300">→</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      <header>
        <div>
          <h2 className="text-3xl font-serif-legal font-bold text-legal-900">Suas Matérias</h2>
          <p className="text-gray-500">Selecione uma área para começar.</p>
        </div>
      </header>

      <FilterBar />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, idx) => {
          const rawQuestions = questions.filter(q => q.materia === subject);
          const filteredCount = applyFilters(rawQuestions).length;

          return (
            <div 
              key={idx}
              onClick={() => handleSubjectClick(subject)}
              className={`group p-8 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[160px] ${
                filteredCount === 0 && !SUBJECT_TOPICS[subject]
                ? 'bg-gray-50 border-gray-100 opacity-60' 
                : 'bg-white border-legal-100 shadow-sm hover:shadow-xl hover:border-legal-300'
              }`}
            >
              <div>
                <p className="text-[10px] font-bold text-legal-400 uppercase tracking-widest mb-2">Matéria</p>
                <h3 className="text-xl font-serif-legal font-bold text-legal-800 group-hover:text-legal-600 transition-colors leading-tight">
                  {subject}
                </h3>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase">{filteredCount} DISPONÍVEIS</span>
                <span className={`text-xs font-bold uppercase transition-colors ${filteredCount > 0 || SUBJECT_TOPICS[subject] ? 'text-legal-500 group-hover:translate-x-1' : 'text-gray-300'}`}>
                  {filteredCount > 0 || SUBJECT_TOPICS[subject] ? 'Selecionar →' : 'Vazio'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
