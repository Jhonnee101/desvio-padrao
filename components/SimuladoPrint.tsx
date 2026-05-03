
import React from 'react';
import { Question } from '../types';

interface SimuladoPrintProps {
  questions: Question[];
}

const SimuladoPrint: React.FC<SimuladoPrintProps> = ({ questions }) => {
  return (
    <div className="hidden print:block p-8 bg-white text-black font-serif-legal">
      <header className="text-center border-b-2 border-black pb-6 mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-widest">Desvio Padrão - Simulado Jurídico</h1>
        <p className="text-sm mt-2">Data: ____/____/_______ • Candidato: ________________________________________________</p>
      </header>

      <div className="space-y-10">
        {questions.map((q, idx) => (
          <div key={q.id} className="break-inside-avoid">
            <div className="font-bold mb-2">Questão {idx + 1} — {q.materia}</div>
            <div className="text-[10px] uppercase font-bold text-gray-600 mb-2 italic">Assunto: {q.assunto}</div>
            <p className="mb-4 leading-relaxed text-sm">{q.enunciado}</p>
            <div className="space-y-2 ml-4">
              {q.alternativas.map((alt, aIdx) => (
                <div key={aIdx} className="flex gap-2 text-sm items-start">
                  <span className="font-bold">({String.fromCharCode(65 + aIdx)})</span>
                  <span>{alt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="page-break-before py-12">
        <div className="border-t-2 border-black pt-12 text-center">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Gabarito Oficial</h2>
          <div className="grid grid-cols-5 gap-4 max-w-2xl mx-auto">
            {questions.map((q, idx) => (
              <div key={idx} className="border border-black p-2 flex justify-between font-bold">
                <span>{idx + 1}</span>
                <span className="text-legal-500">{String.fromCharCode(65 + q.indiceCorreto)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimuladoPrint;
