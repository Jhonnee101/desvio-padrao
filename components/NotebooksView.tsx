
import React, { useState } from 'react';
import { Notebook, Question } from '../types';

interface NotebooksViewProps {
  notebooks: Notebook[];
  allQuestions: Question[];
  onBack: () => void;
}

const NotebooksView: React.FC<NotebooksViewProps> = ({ notebooks, allQuestions, onBack }) => {
  const [selectedNotebookId, setSelectedNotebookId] = useState<string | null>(null);

  const selectedNotebook = notebooks.find(n => n.id === selectedNotebookId);
  const notebookQuestions = selectedNotebook 
    ? allQuestions.filter(q => selectedNotebook.questoesIds.includes(q.id))
    : [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif-legal font-bold text-legal-900">Meus Cadernos</h2>
          <p className="text-gray-500">Acompanhe suas questões salvas e revisões.</p>
        </div>
        <button onClick={onBack} className="text-legal-500 font-bold hover:underline">Voltar</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Notebook List */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cadernos Disponíveis</h3>
          {notebooks.length === 0 && <p className="text-sm text-gray-400 italic">Você ainda não criou cadernos.</p>}
          <div className="flex flex-col gap-2">
            {notebooks.map(nb => (
              <button 
                key={nb.id}
                onClick={() => setSelectedNotebookId(nb.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${selectedNotebookId === nb.id ? 'bg-legal-500 text-white border-legal-600 shadow-md' : 'bg-white text-legal-800 border-legal-100 hover:border-legal-300'}`}
              >
                <div className="font-bold truncate">{nb.nome}</div>
                <div className={`text-[10px] uppercase font-bold ${selectedNotebookId === nb.id ? 'text-legal-100' : 'text-gray-400'}`}>
                  {nb.questoesIds.length} Itens
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 min-h-[500px] bg-white rounded-2xl border border-legal-200 p-8 shadow-sm">
          {!selectedNotebookId ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
              <div className="text-6xl opacity-20">📂</div>
              <p>Selecione um caderno para visualizar o conteúdo.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-legal-100 pb-4">
                <h3 className="text-2xl font-serif-legal font-bold text-legal-800">{selectedNotebook?.nome}</h3>
                <span className="bg-legal-100 text-legal-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {notebookQuestions.length} questões salvas
                </span>
              </div>

              <div className="space-y-8">
                {notebookQuestions.length === 0 && <p className="text-center py-12 text-gray-400 italic">Este caderno está vazio.</p>}
                {notebookQuestions.map((q, idx) => (
                  <div key={q.id} className="p-6 rounded-xl border border-legal-50 hover:border-legal-200 bg-legal-50/20 space-y-4 group">
                    <div className="flex justify-between items-start">
                      <div className="text-[10px] font-bold text-legal-400 uppercase tracking-widest">
                        {q.materia} • {q.assunto}
                      </div>
                      <span className="text-xs text-gray-300 group-hover:text-gray-400">#{q.id}</span>
                    </div>
                    <p className="font-medium text-gray-800 line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                      {q.enunciado}
                    </p>
                    <div className="pt-2">
                      <div className="text-xs font-bold text-green-600 uppercase mb-1">Resposta Correta:</div>
                      <p className="text-sm text-gray-600 italic bg-white p-3 rounded border border-green-100">{q.alternativas[q.indiceCorreto]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotebooksView;
