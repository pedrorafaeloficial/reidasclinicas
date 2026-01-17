
import React from 'react';
import { REVIEWS, FAQS, CONTACT_WHATSAPP, WHATSAPP_MESSAGE } from '../constants';

interface LandingPageProps {
  onStartBrowsing: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartBrowsing }) => {
  const handleWhatsApp = () => {
    window.open(`https://wa.me/55${CONTACT_WHATSAPP}?text=${WHATSAPP_MESSAGE}`, '_blank');
  };

  return (
    <div className="animate-in fade-in duration-700">
      <section className="relative pt-20 pb-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#2563eb] animate-pulse"></span>
              <span className="text-sm font-semibold text-[#2563eb] uppercase tracking-wider">O Maior do Brasil</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold text-[#0f172a] tracking-tight leading-[1.1] mb-6">
              Conquiste sua Tão sonhada <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-blue-400">Clínica Lucrativa!</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
              Não compre apenas um imóvel, compre um negócio faturando. O Rei das Clínicas é a sua ponte segura para o sucesso no setor de saúde.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={onStartBrowsing}
                className="px-8 py-4 bg-[#2563eb] text-white rounded-xl font-bold text-lg hover:bg-[#1d4ed8] transition-all shadow-xl shadow-blue-200"
              >
                Ver Clínicas Disponíveis
              </button>
              <button 
                onClick={handleWhatsApp}
                className="px-8 py-4 bg-white border border-slate-200 text-[#0f172a] rounded-xl font-bold text-lg hover:border-[#2563eb] hover:text-[#2563eb] transition-all"
              >
                Falar com Consultor
              </button>
            </div>
          </div>
          
          <div className="mt-20 border border-blue-100 rounded-2xl bg-blue-50/30 p-4 shadow-2xl relative">
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl"></div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl"></div>
             <div className="bg-white rounded-xl border border-blue-100 overflow-hidden shadow-sm">
                <div className="h-12 border-b border-blue-50 bg-blue-50/20 flex items-center px-4 space-x-2">
                   <div className="w-3 h-3 rounded-full bg-red-400"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                   <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                      <p className="text-xs font-bold text-blue-400 uppercase mb-1">Faturamento Médio</p>
                      <p className="text-3xl font-extrabold text-[#2563eb]">R$ 1.43M</p>
                      <div className="mt-2 text-green-500 text-sm font-medium">↑ 12.5% vs último ano</div>
                   </div>
                   <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                      <p className="text-xs font-bold text-blue-400 uppercase mb-1">Clínicas Vendidas</p>
                      <p className="text-3xl font-extrabold text-[#2563eb]">342</p>
                      <div className="mt-2 text-slate-500 text-sm font-medium">Líder no mercado nacional</div>
                   </div>
                   <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                      <p className="text-xs font-bold text-blue-400 uppercase mb-1">ROI Projetado</p>
                      <p className="text-3xl font-extrabold text-[#2563eb]">24 meses</p>
                      <div className="mt-2 text-slate-500 text-sm font-medium">Retorno rápido e seguro</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-center text-[#2563eb] font-bold uppercase tracking-widest text-sm mb-4">A Nossa Missão</h2>
          <h3 className="text-4xl font-extrabold text-[#0f172a] mb-12 text-center">Por que o "Rei das Clínicas"?</h3>
          
          <div className="prose prose-lg prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed font-normal">
            <p>
              Comprar uma clínica não é apenas assinar um contrato de aluguel. É herdar uma reputação, uma equipe e, acima de tudo, um fluxo de caixa. O grande problema é que 90% dos vendedores escondem dívidas, problemas trabalhistas ou inflama o faturamento real.
            </p>
            <div className="bg-[#2563eb] text-white p-8 rounded-2xl shadow-xl rotate-1">
              <p className="text-2xl font-bold italic mb-4">"Eu cansei de ver bons profissionais de saúde perdendo as economias de uma vida em negócios furados."</p>
              <p className="font-semibold">— Fundador, Rei das Clínicas</p>
            </div>
            <p>
              Por isso criamos o ecossistema do Rei. Nós fazemos a <strong>Due Diligence</strong> por você. Nós batemos o pé na negociação para garantir que você não pague o "preço de sonhador", mas sim o valor justo de mercado com base no múltiplo de EBITDA real.
            </p>
            <p>
              Nossa equipe de especialistas já intermediou mais de <strong>R$ 200 milhões</strong> em transações apenas nos últimos 24 meses. Somos a única plataforma que oferece suporte desde a escolha do imóvel até a transição completa da gestão.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#0f172a] mb-4">O que dizem os nossos Compradores</h2>
            <p className="text-slate-600">Mais de 1.000 vidas profissionais transformadas através de negociações estratégicas.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {REVIEWS.map((review) => (
              <div key={review.id} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg hover:border-blue-100 transition-all group">
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <p className="text-slate-600 italic mb-6">"{review.comentario}"</p>
                <div className="flex items-center">
                  <img src={review.avatar} alt={review.nome} className="w-12 h-12 rounded-full mr-4 border-2 border-white shadow-sm" />
                  <div>
                    <h4 className="font-bold text-[#0f172a] text-sm group-hover:text-[#2563eb] transition-colors">{review.nome}</h4>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">{review.cargo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0f172a] text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold mb-12 text-center tracking-tight">Perguntas Frequentes</h2>
          <div className="space-y-6">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-slate-800/30 p-6 rounded-2xl border border-slate-800 hover:border-blue-900 transition-colors group">
                <h4 className="text-lg font-bold mb-2 text-slate-100 group-hover:text-[#2563eb] transition-colors">{faq.pergunta}</h4>
                <p className="text-slate-400 leading-relaxed">{faq.resposta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="fixed bottom-8 right-8 z-40">
        <button 
          onClick={handleWhatsApp}
          className="flex items-center space-x-2 bg-[#2563eb] text-white px-8 py-4 rounded-full font-bold shadow-2xl shadow-blue-400/30 hover:scale-105 hover:bg-[#1d4ed8] active:scale-95 transition-all animate-bounce"
        >
          <span>QUERO COMPRAR MINHA CLÍNICA</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      </div>
    </div>
  );
};
