import React, { useState } from 'react';
import { Question, SUBJECT_TOPICS } from '../types';

interface AdminPanelProps {
  subjects: string[];
  questions: Question[];
  onAddSubject: (name: string) => void;
  onAddQuestions: (questions: (Omit<Question, 'id'> & { id?: string })[]) => void;
  onUpdateQuestion: (question: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ subjects, questions, onAddSubject, onAddQuestions, onUpdateQuestion, onDeleteQuestion, onBack }) => {
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'import' | 'list'>('form');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMateria, setFilterMateria] = useState<string>('all');

  const [formData, setFormData] = useState({
    materia: subjects[0] || '',
    assunto: '',
    enunciado: '',
    alternativas: ['', '', '', '', ''],
    indiceCorreto: 0,
    explicacao: ''
  });

  const resetForm = () => {
    setFormData({
      materia: subjects[0] || '',
      assunto: '',
      enunciado: '',
      alternativas: ['', '', '', '', ''],
      indiceCorreto: 0,
      explicacao: ''
    });
    setEditingId(null);
    setError(null);
    setSuccessMsg(null);
  };

  const handleAddAlternative = () => {
    setFormData(f => ({
      ...f,
      alternativas: [...f.alternativas, ''],
      indiceCorreto: f.indiceCorreto
    }));
  };

  const handleRemoveAlternative = (idx: number) => {
    if (formData.alternativas.length <= 2) {
      setError('A questão deve ter pelo menos 2 alternativas.');
      return;
    }
    const newAlts = formData.alternativas.filter((_, i) => i !== idx);
    setFormData(f => ({
      ...f,
      alternativas: newAlts,
      indiceCorreto: f.indiceCorreto >= newAlts.length ? newAlts.length - 1 : f.indiceCorreto
    }));
  };

  const handleUpdateAlternative = (idx: number, value: string) => {
    const newAlts = [...formData.alternativas];
    newAlts[idx] = value;
    setFormData(f => ({ ...f, alternativas: newAlts }));
  };

  const handleEditQuestion = (q: Question) => {
    setFormData({
      materia: q.materia,
      assunto: q.assunto,
      enunciado: q.enunciado,
      alternativas: [...q.alternativas],
      indiceCorreto: q.indiceCorreto,
      explicacao: q.explicacao
    });
    setEditingId(q.id);
    setActiveSubTab('form');
    setError(null);
    setSuccessMsg(null);
  };

  const handleDeleteQuestion = (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta questão?')) return;
    onDeleteQuestion(id);
    setSuccessMsg('Questão excluída com sucesso!');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!formData.enunciado.trim() || !formData.assunto.trim()) {
      setError('Preencha o enunciado e o assunto.');
      return;
    }
    if (formData.alternativas.some(a => !a.trim())) {
      setError('Preencha todas as alternativas.');
      return;
    }

    if (editingId) {
      const updatedQuestion: Question = {
        id: editingId,
        ...formData
      };
      onUpdateQuestion(updatedQuestion);
      setSuccessMsg('Questão atualizada com sucesso!');
    } else {
      // addQuestions irá gerar ID único automaticamente
      onAddQuestions([formData]);
      setSuccessMsg('Questão salva com sucesso!');
    }
    resetForm();
  };

  const handleJsonFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSuccessMsg(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const data = JSON.parse(text.trim());
        const questionsToUpload: Question[] = Array.isArray(data) ? data : [data];

        if (questionsToUpload.some(q => !q.materia || !q.enunciado || !q.alternativas)) {
          throw new Error("Formato inválido. Verifique se o JSON contém: materia, enunciado, alternativas.");
        }

        // Remove IDs para garantir que addQuestions gere novos únicos
        const prepared = questionsToUpload.map(q => {
          const { id, ...rest } = q as any;
          return rest;
        });

        onAddQuestions(prepared);
        setSuccessMsg(`Sucesso! ${prepared.length} questão(ões) importada(s).`);
      } catch (err: any) {
        setError('Erro ao ler arquivo: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.name.endsWith('.json')) {
      setError('Por favor, solte um arquivo .json válido.');
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.files = e.dataTransfer.files;
    handleJsonFileUpload({ target: input, files: e.dataTransfer.files } as any);
  };

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = "questions.json";
    a.click();
  };

  const filteredQuestions = questions.filter(q => {
    if (filterMateria !== 'all' && q.materia !== filterMateria) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return q.enunciado.toLowerCase().includes(term) ||
             q.assunto.toLowerCase().includes(term) ||
             q.materia.toLowerCase().includes(term);
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-fadeIn">
      <div className="flex justify-end">
        <button onClick={downloadJson} className="text-sm bg-legal-100 text-legal-700 px-4 py-2 rounded-lg hover:bg-legal-200 font-medium">
          ⬇ Baixar questions.json
        </button>
      </div>

      <h2 className="text-3xl font-serif-legal font-bold text-legal-900">Administração do Banco</h2>

      <div className="flex gap-4 border-b border-legal-100">
        {[
          { id: 'form', label: 'Cadastrar Questão', icon: '✍️' },
          { id: 'import', label: 'Importar JSON', icon: '📂' },
          { id: 'list', label: `Questões (${questions.length})`, icon: '📋' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveSubTab(tab.id as any); setError(null); setSuccessMsg(null); }}
            className={`pb-3 text-sm font-bold transition-all flex items-center gap-2 ${activeSubTab === tab.id ? 'text-legal-500 border-b-2 border-legal-500' : 'text-gray-400 hover:text-legal-300'}`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100 animate-slideUp">⚠️ {error}</div>}
      {successMsg && <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-bold border border-green-100 animate-slideUp">✅ {successMsg}</div>}

      {activeSubTab === 'form' && (
        <form onSubmit={handleFormSubmit} className="bg-white p-8 rounded-2xl border border-legal-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-legal-800">
              {editingId ? 'Editar Questão' : 'Nova Questão'}
            </h3>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-700">
                Cancelar edição
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-legal-500 uppercase">Matéria</label>
              <select
                className="w-full border border-legal-200 rounded-xl p-3 outline-none focus:border-legal-500"
                value={formData.materia}
                onChange={e => setFormData({ ...formData, materia: e.target.value, assunto: '' })}
              >
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-legal-500 uppercase">Assunto</label>
              <input
                list="topics-list"
                className="w-full border border-legal-200 rounded-xl p-3 outline-none focus:border-legal-500"
                placeholder="Ex: Teoria do Crime"
                value={formData.assunto}
                onChange={e => setFormData({ ...formData, assunto: e.target.value })}
              />
              <datalist id="topics-list">
                {(SUBJECT_TOPICS[formData.materia] || []).map(t => <option key={t} value={t} />)}
              </datalist>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-legal-500 uppercase">Enunciado</label>
            <textarea
              className="w-full h-32 border border-legal-200 rounded-xl p-4 outline-none focus:border-legal-500 bg-legal-50/20 resize-none"
              placeholder="Digite o enunciado da questão..."
              value={formData.enunciado}
              onChange={e => setFormData({ ...formData, enunciado: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-legal-500 uppercase">Alternativas</label>
              <button type="button" onClick={handleAddAlternative} className="text-xs text-legal-500 hover:underline">
                + Adicionar alternativa
              </button>
            </div>
            {formData.alternativas.map((alt, idx) => (
              <div key={idx} className="flex gap-3 items-center group">
                <input
                  type="radio"
                  name="correct"
                  checked={formData.indiceCorreto === idx}
                  onChange={() => setFormData({ ...formData, indiceCorreto: idx })}
                  className="w-5 h-5 accent-legal-500 shrink-0"
                />
                <span className="font-bold text-xs text-legal-300 w-5">{String.fromCharCode(65 + idx)}</span>
                <input
                  type="text"
                  className="flex-grow border border-legal-200 rounded-xl p-2 outline-none focus:border-legal-500 text-sm"
                  value={alt}
                  onChange={e => handleUpdateAlternative(idx, e.target.value)}
                  placeholder={`Alternativa ${String.fromCharCode(65 + idx)}`}
                />
                {formData.alternativas.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAlternative(idx)}
                    className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <p className="text-xs text-legal-400">Selecione o botão ao lado da alternativa correta.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-legal-500 uppercase">Explicação</label>
            <textarea
              className="w-full h-24 border border-legal-200 rounded-xl p-4 outline-none focus:border-legal-500 bg-legal-50/20 resize-none"
              placeholder="Explicação da resposta correta..."
              value={formData.explicacao}
              onChange={e => setFormData({ ...formData, explicacao: e.target.value })}
            />
          </div>

          <button type="submit" className="w-full bg-legal-500 text-white py-4 rounded-xl font-bold hover:bg-legal-600 shadow-lg transition-all active:scale-95">
            {editingId ? 'Atualizar Questão' : 'Salvar Questão'}
          </button>
        </form>
      )}

      {activeSubTab === 'import' && (
        <div className="bg-white p-8 rounded-2xl border border-legal-200 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-legal-800">Importar Questões via JSON</h3>
            <p className="text-sm text-gray-500">Envie um arquivo .json com uma ou mais questões</p>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            className="border-2 border-dashed border-legal-300 rounded-2xl p-12 text-center hover:border-legal-500 transition-colors"
          >
            <div className="text-4xl mb-4">📂</div>
            <p className="text-sm text-gray-500 mb-4">Arraste um arquivo .json aqui ou clique para selecionar</p>
            <label className="inline-block bg-legal-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-legal-600 cursor-pointer transition-all">
              Selecionar Arquivo
              <input type="file" accept=".json" onChange={handleJsonFileUpload} className="hidden" />
            </label>
          </div>

          <div className="bg-legal-50 p-4 rounded-xl text-xs text-legal-600 space-y-1">
            <p className="font-bold">Formato esperado do JSON:</p>
            <pre className="bg-white p-3 rounded-lg overflow-x-auto text-[10px]">
{`[
  {
    "materia": "Direito Penal Parte Geral",
    "assunto": "Teoria do Crime",
    "enunciado": "Questão exemplo...",
    "alternativas": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "indiceCorreto": 0,
    "explicacao": "Explicação..."
  }
]`}
            </pre>
          </div>
        </div>
      )}

      {activeSubTab === 'list' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-legal-200">
            <input
              type="text"
              placeholder="Buscar por enunciado, assunto..."
              className="flex-1 min-w-[200px] border border-legal-200 rounded-lg p-2 text-sm outline-none focus:border-legal-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select
              className="border border-legal-200 rounded-lg p-2 text-sm outline-none focus:border-legal-500"
              value={filterMateria}
              onChange={e => setFilterMateria(e.target.value)}
            >
              <option value="all">Todas as matérias</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="text-sm text-gray-500 self-center">
              {filteredQuestions.length} questão(ões)
            </span>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>Nenhuma questão encontrada.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((q, idx) => (
                <div key={q.id} className="bg-white border border-legal-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-legal-500 bg-legal-100 px-2 py-0.5 rounded">
                          {q.materia}
                        </span>
                        <span className="text-xs text-gray-400">{q.assunto}</span>
                      </div>
                      <p className="text-sm text-legal-800 line-clamp-2">{idx + 1}. {q.enunciado}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {q.alternativas.map((a, i) => (
                          <span key={i} className={`text-[10px] px-2 py-0.5 rounded ${i === q.indiceCorreto ? 'bg-green-100 text-green-700 font-bold' : 'bg-gray-100 text-gray-600'}`}>
                            {String.fromCharCode(65 + i)}: {a.substring(0, 30)}{a.length > 30 ? '...' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleEditQuestion(q)}
                        className="p-2 text-legal-500 hover:bg-legal-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 1v8a2 2 0 002 2h8a2 2 0 002-2V5h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
