
import React from 'react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center text-center py-12 md:py-24 space-y-8 pb-20">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-4xl md:text-6xl font-serif-legal font-bold text-legal-900 leading-tight">
          Excelência em <span className="text-legal-500">Concursos Jurídicos</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Plataforma especializada na resolução de questões comentadas, 
          organização de cadernos de erros e métricas de desempenho para carreiras jurídicas.
        </p>
      </div>

      <div className="relative w-full max-w-4xl h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
        <img 
          src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1200" 
          alt="Ambiente de estudos" 
          className="w-full h-full object-cover grayscale opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-legal-900/60 to-transparent flex items-end justify-center pb-12">
          <button 
            onClick={onStart}
            className="bg-white text-legal-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-legal-50 transition-all transform hover:-translate-y-1 shadow-lg"
          >
            Começar a Praticar Agora
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl pt-12">
        <FeatureCard 
          icon="⚖️"
          title="Foco Jurídico"
          description="Identifique automaticamente as matérias e assuntos onde seu desempenho está abaixo de 80% e foque onde importa."
        />
        <FeatureCard 
          icon="📝"
          title="Cadernos de Erros"
          description="Metodologia ativa: organize questões desafiadoras em cadernos personalizados para revisão estratégica."
        />
        <FeatureCard 
          icon="📊"
          title="Estatísticas Completas"
          description="Acompanhe sua evolução detalhada com métricas de acerto por matéria, assunto e tempo de resposta."
        />
      </div>
      
      <div className="pt-12">
        <button 
          disabled 
          className="text-gray-300 font-bold flex items-center gap-1 cursor-not-allowed"
          title="Página Inicial"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Início
        </button>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: string, title: string, description: string }) => (
  <div className="bg-white p-8 rounded-2xl border border-legal-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-legal-800 mb-2 font-serif-legal">{title}</h3>
    <p className="text-gray-500 text-sm">{description}</p>
  </div>
);

export default Landing;
