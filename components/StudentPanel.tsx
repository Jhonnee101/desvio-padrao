
import React, { useState, useMemo } from 'react';
import { Question, PerformanceRecord, INITIAL_SUBJECTS, SUBJECT_TOPICS, View } from '../types';
import SimuladoPrint from './SimuladoPrint';

interface StudentPanelProps {
  errorNotebookIds: string[];
  allQuestions: Question[];
  performance: PerformanceRecord[];
  userComments: Record<string, string>;
  onSaveComment: (id: string, comment: string) => void;
  onBack: () => void;
  onStartSession: (questions: Question[], mode: View) => void;
}

const StudentPanel: React.FC<StudentPanelProps> = ({ 
  errorNotebookIds, 
  allQuestions, 
  performance, 
  userComments,
  onSaveComment,
  onBack, 
  onStartSession 
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'notebooks' | 'simulados'>('stats');
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [expandedNotebookSubject, setExpandedNotebookSubject] = useState<string | null>(null);
  const [simuladoConfig, setSimuladoConfig] = useState<Record<string, { selecionada: boolean, quantidade: number, assuntos: string[] }>>({});
  const [hideSolved, setHideSolved] = useState(false);
  const [hideInNotebook, setHideInNotebook] = useState(false);
  const [printPool, setPrintPool] = useState<Question[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [tempComment, setTempComment] = useState("");

  const solvedIds = useMemo(() => new Set(performance.map(p => p.questionId)), [performance]);
  const notebookIdsSet = useMemo(() => new Set(errorNotebookIds), [errorNotebookIds]);

  const applyFilters = (qs: Question[]) => {
    return qs.filter(q => {
      if (hideSolved && solvedIds.has(q.id)) return false;
      if (hideInNotebook && notebookIdsSet.has(q.id)) return false;
      return true;
    });
  };

  const errorQuestions = useMemo(() => {
    return allQuestions.filter(q => errorNotebookIds.includes(q.id));
  }, [allQuestions, errorNotebookIds]);

  const notebookStructure = useMemo(() => {
    const structure: Record<string, Record<string, Question[]>> = {};
    errorQuestions.forEach(q => {
      if (!structure[q.materia]) structure[q.materia] = {};
      if (!structure[q.materia][q.assunto]) structure[q.materia][q.assunto] = [];
      structure[q.materia][q.assunto].push(q);
    });
    return structure;
  }, [errorQuestions]);

  const stats = useMemo(() => {
    const data: Record<string, { total: number, correct: number, lastDate: number }> = {};
    performance.forEach(p => {
      const key = `${p.materia} - ${p.assunto}`;
      if (!data[key]) data[key] = { total: 0, correct: 0, lastDate: 0 };
      data[key].total++;
      if (p.isCorrect) data[key].correct++;
      if (p.timestamp > data[key].lastDate) data[key].lastDate = p.timestamp;
    });
    return Object.entries(data).map(([name, val]) => ({
      name,
      percent: (val.correct / val.total) * 100,
      total: val.total,
      correct: val.correct,
      errors: val.total - val.correct,
      lastDate: val.lastDate
    }));
  }, [performance]);

  const focoJuridico = useMemo(() => {
    return stats
      .filter(s => s.percent < 80)
      .sort((a, b) => b.errors - a.errors); 
  }, [stats]);

  const getRevisionStatus = (timestamp: number) => {
    if (!timestamp) return { color: 'bg-gray-200', text: 'Nunca' };
    const diffDays = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
    if (diffDays <= 10) return { color: 'bg-green-500', text: `${diffDays}d ago`, label: 'Em dia' };
    if (diffDays <= 20) return { color: 'bg-yellow-500', text: `${diffDays}d ago`, label: 'Revisar' };
    return { color: 'bg-red-500', text: `${diffDays}d ago`, label: 'Atrasado' };
  };

  const startEditComment = (id: string) => {
    setEditingCommentId(id);
    setTempComment(userComments[id] || "");
  };

  const saveComment = (id: string) => {
    onSaveComment(id, tempComment);
    setEditingCommentId(null);
  };

  const handleToggleSubject = (sub: string) => {
    const current = simuladoConfig[sub] || { selecionada: false, quantidade: 0, assuntos: [] };
    setSimuladoConfig({
      ...simuladoConfig,
      [sub]: { ...current, selecionada: !current.selecionada, assuntos: !current.selecionada ? (SUBJECT_TOPICS[sub] || []) : [] }
    });
  };

  const handleToggleTopic = (sub: string, topic: string) => {
    const current = simuladoConfig[sub] || { selecionada: false, quantidade: 0, assuntos: [] };
    const newAssuntos = current.assuntos.includes(topic) 
      ? current.assuntos.filter(t => t !== topic)
      : [...current.assuntos, topic];
    setSimuladoConfig({
      ...simuladoConfig,
      [sub]: { ...current, assuntos: newAssuntos, selecionada: newAssuntos.length > 0 }
    });
  };

  const handleSelectAll = () => {
    const newConfig: Record<string, { selecionada: boolean, quantidade: number, assuntos: string[] }> = {};
    INITIAL_SUBJECTS.forEach(sub => {
      newConfig[sub] = { selecionada: true, quantidade: 10, assuntos: SUBJECT_TOPICS[sub] || [] };
    });
    setSimuladoConfig(newConfig);
  };

  const generatePool = () => {
    let pool: Question[] = [];
    Object.keys(simuladoConfig).forEach((sub) => {
      const config = simuladoConfig[sub];
      if (config.selecionada && config.quantidade > 0) {
        let subQuestions = allQuestions.filter(q => q.materia === sub && (config.assuntos.length === 0 || config.assuntos.includes(q.assunto)));
        let filteredSubQs = applyFilters(subQuestions);
        const shuffled = [...filteredSubQs].sort(() => 0.5 - Math.random());
        pool = [...pool, ...shuffled.slice(0, config.quantidade)];
      }
    });
    return pool;
  };

  const handleStartSimulado = () => {
    const pool = generatePool();
    if (pool.length > 0) onStartSession(pool, 'simulado-active');
    else alert("Selecione matérias com questões disponíveis.");
  };

  const handlePrint = () => {
    const pool = generatePool();
    if (pool.length > 0) {
      setPrintPool(pool);
      setTimeout(() => { window.print(); setPrintPool([]); }, 500);
    } else alert("Selecione ao menos uma matéria.");
  };

  const BackButton = () => (
    <button onClick={onBack} className="text-legal-500 font-bold hover:underline flex items-center gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
      </svg>
      Voltar para o Dashboard
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-20 print:hidden">
      {printPool.length > 0 && <SimuladoPrint questions={printPool} />}
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <BackButton />
          <h2 className="text-3xl font-serif-legal font-bold text-legal-900 mt-4">Painel do Estudante</h2>
          <p className="text-gray-500">Gerencie seu desempenho, cadernos e simulados.</p>
        </div>
        <div className="flex bg-white rounded-xl border border-legal-200 p-1 shadow-sm">
          {['stats', 'notebooks', 'simulados'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-legal-500 text-white shadow-md' : 'text-gray-500 hover:text-legal-500'}`}>
              {tab === 'stats' ? 'Estatísticas' : tab === 'notebooks' ? 'Caderno de Erros' : 'Simulados'}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'stats' && (
        <div className="space-y-12">
          <section className="bg-white p-8 rounded-2xl border border-legal-200 shadow-sm">
            <h3 className="text-xl font-serif-legal font-bold text-legal-800 border-b border-legal-100 pb-4 mb-6 flex items-center">
              <span className="mr-2 text-2xl">📅</span> Controle de Revisões (Farol de Estudo)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-legal-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="pb-4">Matéria / Assunto</th>
                    <th className="pb-4 text-center">Status</th>
                    <th className="pb-4 text-right">Última Resolução</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.map((s, idx) => {
                    const status = getRevisionStatus(s.lastDate);
                    return (
                      <tr key={idx} className="hover:bg-legal-50/50 transition-colors">
                        <td className="py-4 font-bold text-legal-900 text-sm">{s.name}</td>
                        <td className="py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                            <span className="text-[10px] font-bold uppercase text-gray-500">{status.label}</span>
                          </div>
                        </td>
                        <td className="py-4 text-right text-xs font-semibold text-gray-500">
                          {s.lastDate ? new Date(s.lastDate).toLocaleDateString() : 'Nunca resolvido'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white p-8 rounded-2xl border border-legal-200 shadow-sm">
            <h3 className="text-xl font-serif-legal font-bold text-legal-800 border-b border-legal-100 pb-4 mb-6 flex items-center">
              <span className="mr-2 text-2xl">⚖️</span> Foco Jurídico (Abaixo de 80%)
            </h3>
            {focoJuridico.length === 0 ? (
              <div className="text-center py-10 bg-green-50 rounded-xl border border-green-100">
                <p className="text-green-700 font-bold">Excelente! Aproveitamento acima de 80% em tudo.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4 items-end">
                {focoJuridico.map((s, idx) => (
                  <div key={idx} className="flex flex-col items-center group">
                    <div className="relative w-16 bg-gray-100 rounded-t-lg overflow-hidden h-40 flex flex-col">
                      <div className="w-full bg-red-500 transition-all" style={{ height: `${100 - s.percent}%` }}></div>
                      <div className="w-full bg-green-500 transition-all" style={{ height: `${s.percent}%` }}></div>
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-legal-900 bg-white/10 group-hover:bg-white/40 flex-col gap-0.5">
                        <span className="text-red-700">{Math.round(100 - s.percent)}% erro</span>
                        <span className="text-green-700">{Math.round(s.percent)}% acerto</span>
                      </div>
                    </div>
                    <div className="mt-2 text-[8px] font-bold text-gray-500 uppercase tracking-tighter w-16 text-center leading-tight truncate">{s.name}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === 'notebooks' && (
        <div className="bg-white p-8 rounded-2xl border border-legal-200 shadow-sm space-y-8">
          <div className="flex justify-between items-center border-b pb-6">
            <div>
              <h3 className="text-2xl font-serif-legal font-bold text-legal-900">Caderno de Erros Personalizado</h3>
              <p className="text-sm text-gray-500">Adicione suas anotações estratégicas às questões que você errou.</p>
            </div>
            <button 
              disabled={errorQuestions.length === 0}
              onClick={() => onStartSession(errorQuestions, 'notebook-session')}
              className="bg-legal-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              🚀 Resolver Questões ({errorQuestions.length})
            </button>
          </div>

          <div className="space-y-6">
            {Object.keys(notebookStructure).length === 0 ? (
              <div className="py-20 text-center opacity-30 text-6xl">📓</div>
            ) : (
              Object.entries(notebookStructure).map(([materia, assuntos]) => (
                <div key={materia} className="border border-legal-100 rounded-xl overflow-hidden">
                  <div className="p-5 bg-legal-50 flex items-center justify-between cursor-pointer" onClick={() => setExpandedNotebookSubject(expandedNotebookSubject === materia ? null : materia)}>
                    <div className="flex items-center gap-4">
                      <span className={`text-legal-300 transition-transform ${expandedNotebookSubject === materia ? 'rotate-90' : ''}`}>▶</span>
                      <div className="font-bold text-legal-900">{materia}</div>
                    </div>
                  </div>
                  {expandedNotebookSubject === materia && (
                    <div className="p-6 bg-white space-y-8">
                      {Object.entries(assuntos).map(([assunto, questoes]) => (
                        <div key={assunto} className="space-y-4">
                          <h4 className="text-xs font-bold text-legal-400 uppercase border-b pb-2">{assunto}</h4>
                          <div className="space-y-6">
                            {questoes.map(q => (
                              <div key={q.id} className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 space-y-4">
                                <p className="text-sm font-medium text-gray-800">{q.enunciado}</p>
                                
                                {/* Seção de Comentário Pessoal */}
                                <div className="mt-4 border-t pt-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-legal-500 uppercase flex items-center gap-1">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                                      </svg>
                                      Meu Comentário Estratégico
                                    </span>
                                    {editingCommentId !== q.id ? (
                                      <button onClick={() => startEditComment(q.id)} className="text-[10px] font-bold text-legal-600 hover:underline">
                                        {userComments[q.id] ? 'Editar' : '+ Adicionar Comentário'}
                                      </button>
                                    ) : (
                                      <div className="flex gap-2">
                                        <button onClick={() => saveComment(q.id)} className="text-[10px] font-bold text-green-600 hover:underline">Salvar</button>
                                        <button onClick={() => setEditingCommentId(null)} className="text-[10px] font-bold text-red-500 hover:underline">Cancelar</button>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {editingCommentId === q.id ? (
                                    <textarea 
                                      className="w-full p-3 text-sm border border-legal-300 rounded-lg outline-none focus:ring-1 focus:ring-legal-500 bg-white"
                                      rows={3}
                                      value={tempComment}
                                      placeholder="Escreva aqui seus gatilhos mentais e por que errou esta questão..."
                                      onChange={(e) => setTempComment(e.target.value)}
                                    />
                                  ) : (
                                    <p className={`text-xs italic ${userComments[q.id] ? 'text-legal-800 font-medium' : 'text-gray-400'}`}>
                                      {userComments[q.id] || "Nenhum comentário adicionado ainda."}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'simulados' && (
        <div className="bg-white p-8 rounded-2xl border border-legal-200 shadow-sm space-y-8 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-legal-100 pb-4">
            <div>
              <h3 className="text-xl font-serif-legal font-bold text-legal-800">Novo Simulado</h3>
              <p className="text-sm text-gray-500">Personalize seu teste e aplique filtros estratégicos.</p>
            </div>
            <div className="flex gap-2">
               <button onClick={handleSelectAll} className="text-xs font-bold text-legal-500 hover:underline">Selecionar Tudo</button>
               <span className="text-gray-300">|</span>
               <button onClick={() => setSimuladoConfig({})} className="text-xs font-bold text-red-400 hover:underline">Limpar</button>
            </div>
          </div>

          <div className="bg-legal-50 p-4 rounded-xl border border-legal-100 flex gap-6">
            <span className="text-[10px] font-bold text-legal-500 uppercase tracking-widest self-center">Filtros Estratégicos:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={hideSolved} onChange={() => setHideSolved(!hideSolved)} className="w-4 h-4 accent-legal-500" />
              <span className="text-xs font-bold text-legal-800">Ocultar Resolvidas</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={hideInNotebook} onChange={() => setHideInNotebook(!hideInNotebook)} className="w-4 h-4 accent-legal-500" />
              <span className="text-xs font-bold text-legal-800">Ocultar do Caderno</span>
            </label>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {INITIAL_SUBJECTS.map((sub) => {
              const isSelected = simuladoConfig[sub]?.selecionada;
              const isExpanded = expandedSubject === sub;
              const topics = SUBJECT_TOPICS[sub] || [];
              const rawSubQs = allQuestions.filter(q => q.materia === sub);
              const availableCount = applyFilters(rawSubQs).length;

              return (
                <div key={sub} className={`border rounded-xl ${isSelected ? 'border-legal-400 bg-legal-50/30' : 'border-gray-100'}`}>
                  <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpandedSubject(isExpanded ? null : sub)}>
                    <input type="checkbox" disabled={availableCount === 0} className="w-5 h-5 accent-legal-500" checked={isSelected || false} onChange={(e) => { e.stopPropagation(); handleToggleSubject(sub); }} />
                    <div className="flex-grow">
                      <div className={`font-bold ${availableCount === 0 ? 'text-gray-300' : 'text-legal-900'}`}>{sub}</div>
                      <div className="text-[10px] uppercase font-bold text-legal-50">{availableCount} disponíveis • {simuladoConfig[sub]?.assuntos?.length || 0} tópicos</div>
                    </div>
                    {isSelected && (
                      <input type="number" className="w-16 border rounded px-2 py-1 text-xs font-bold" min="0" max={availableCount} value={simuladoConfig[sub]?.quantidade || 0} onClick={e => e.stopPropagation()} onChange={(e) => setSimuladoConfig({...simuladoConfig, [sub]: {...simuladoConfig[sub], quantidade: Math.min(parseInt(e.target.value) || 0, availableCount)}})} />
                    )}
                    <span className={`text-legal-300 ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                  </div>
                  {isExpanded && topics.length > 0 && (
                    <div className="px-12 pb-6 pt-2 border-t border-legal-100/50 bg-white/50 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {topics.map(t => (
                          <label key={t} className="flex items-center gap-3 text-sm p-2 rounded hover:bg-legal-100/30 cursor-pointer">
                            <input type="checkbox" className="accent-legal-400" checked={simuladoConfig[sub]?.assuntos?.includes(t) || false} onChange={() => handleToggleTopic(sub, t)} />
                            <span className="text-legal-900 font-bold text-xs leading-tight">{t}</span>
                          </label>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-center items-center gap-4 sticky bottom-0 bg-white/95 py-6 border-t border-legal-100">
            <button onClick={handleStartSimulado} className="bg-legal-900 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:bg-black shadow-xl">🚀 Iniciar Simulado</button>
            <button onClick={handlePrint} className="bg-white border-2 border-legal-900 text-legal-900 px-12 py-4 rounded-2xl font-bold text-lg hover:bg-legal-50 flex items-center gap-2"><span>🖨️</span> Imprimir</button>
          </div>
        </div>
      )}
      
      <div className="pt-10 flex justify-center">
        <BackButton />
      </div>
    </div>
  );
};

export default StudentPanel;
