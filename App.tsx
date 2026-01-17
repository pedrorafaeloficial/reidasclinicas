
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { CatalogPage } from './pages/CatalogPage';
import { DossierPage } from './pages/DossierPage';
import { Clinica } from './types';
import { INITIAL_CLINICS, CONTACT_WHATSAPP_FORMATTED } from './constants';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'catalog' | 'dossier'>('home');
  const [selectedClinic, setSelectedClinic] = useState<Clinica | null>(null);
  const [clinics, setClinics] = useState<Clinica[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSocialProof, setShowSocialProof] = useState(false);
  const [viewerCount, setViewerCount] = useState(12);

  useEffect(() => {
    fetchClinics();

    // Lógica para o Pop-up de Prova Social (Aparece e some sozinho)
    let timeoutId: number;

    const triggerPopup = () => {
      // Define um número aleatório de pessoas (entre 8 e 35)
      setViewerCount(Math.floor(Math.random() * (35 - 8 + 1)) + 8);
      
      // Mostra o pop-up
      setShowSocialProof(true);

      // Programado para sumir sozinho após 6 segundos
      timeoutId = window.setTimeout(() => {
        setShowSocialProof(false);
        
        // Após sumir, agenda a próxima aparição em um intervalo aleatório (entre 15 e 40 segundos)
        const nextInterval = Math.floor(Math.random() * (40000 - 15000 + 1)) + 15000;
        timeoutId = window.setTimeout(triggerPopup, nextInterval);
      }, 6000);
    };

    // Inicia a primeira exibição após 4 segundos da página carregar
    timeoutId = window.setTimeout(triggerPopup, 4000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const fetchClinics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clinicas')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Erro Supabase:', error.message);
        setClinics(INITIAL_CLINICS);
      } else if (data && data.length > 0) {
        const mappedData = data.map((item: any) => ({
          ...item,
          faturamentoMensal: item.faturamento_mensal || item.faturamentoMensal,
          fotos: Array.isArray(item.fotos) ? item.fotos : [item.imagem]
        }));
        setClinics(mappedData);
      } else {
        setClinics(INITIAL_CLINICS);
      }
    } catch (err) {
      console.error('Erro inesperado ao buscar clínicas:', err);
      setClinics(INITIAL_CLINICS);
    } finally {
      setLoading(false);
    }
  };

  const navigate = (page: 'home' | 'catalog' | 'dossier') => {
    setCurrentPage(page);
    if (page !== 'dossier') setSelectedClinic(null);
    window.scrollTo(0, 0);
  };

  const openDossier = (clinic: Clinica) => {
    setSelectedClinic(clinic);
    setCurrentPage('dossier');
    window.scrollTo(0, 0);
  };

  const updateClinicLocally = (updated: Clinica) => {
    setClinics(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelectedClinic(updated);
  };

  const addClinic = async (newClinic: Omit<Clinica, 'id'>) => {
    try {
      const payload: any = {
        nome: newClinic.nome,
        localizacao: newClinic.localizacao,
        preco: newClinic.preco,
        faturamento_mensal: newClinic.faturamentoMensal,
        descricao: newClinic.descricao,
        imagem: newClinic.imagem,
        especialidades: newClinic.especialidades
      };

      const { data, error } = await supabase
        .from('clinicas')
        .insert([{ ...payload, fotos: [newClinic.imagem] }])
        .select();

      if (error) {
        if (error.message.includes('column "fotos"')) {
           const { data: retryData, error: retryError } = await supabase
            .from('clinicas')
            .insert([payload])
            .select();
            
           if (retryError) throw retryError;
           if (retryData) handleSuccess(retryData[0]);
        } else {
          throw error;
        }
      } else if (data) {
        handleSuccess(data[0]);
      }
    } catch (err: any) {
      console.error('Erro ao cadastrar:', err);
      alert(`Erro: ${err.message}`);
    }
  };

  const handleSuccess = (savedItem: any) => {
    const savedClinic = { 
      ...savedItem, 
      faturamentoMensal: savedItem.faturamento_mensal,
      fotos: savedItem.fotos || [savedItem.imagem]
    };
    setClinics(prev => [savedClinic, ...prev]);
    alert('Clínica cadastrada com sucesso!');
  };

  const removeClinic = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este anúncio?')) return;
    try {
      const { error } = await supabase.from('clinicas').delete().eq('id', id);
      if (!error) {
        setClinics(prev => prev.filter(c => c.id !== id));
      } else {
        alert('Erro ao deletar: ' + error.message);
      }
    } catch (err) {
      console.error('Erro na deleção:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Pop-up de Prova Social que aparece e some sozinho */}
      <div className={`fixed bottom-6 left-6 z-[100] transition-all duration-700 transform ${showSocialProof ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
        <div className="bg-white/95 backdrop-blur-md border border-blue-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl p-4 flex items-center space-x-4 max-w-xs">
          <div className="relative">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
          <div>
            <p className="text-[#0f172a] text-sm font-black tracking-tight leading-tight">
              <span className="text-[#2563eb]">{viewerCount} pessoas</span> estão olhando clínicas nesse momento.
            </p>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1">Alta procura agora!</p>
          </div>
          <button onClick={() => setShowSocialProof(false)} className="text-slate-300 hover:text-slate-500 p-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <Navbar 
        isAdmin={isAdmin} 
        onAdminLogin={setIsAdmin} 
        currentPage={currentPage === 'dossier' ? 'catalog' : currentPage} 
        onNavigate={navigate} 
      />
      
      <main className="flex-grow">
        {currentPage === 'home' && <LandingPage onStartBrowsing={() => navigate('catalog')} />}
        {currentPage === 'catalog' && (
          <div className={loading ? "opacity-50 pointer-events-none" : ""}>
            <CatalogPage 
              isAdmin={isAdmin} 
              clinics={clinics} 
              onAddClinic={addClinic}
              onRemoveClinic={removeClinic}
              onViewDossier={openDossier}
            />
          </div>
        )}
        {currentPage === 'dossier' && selectedClinic && (
          <DossierPage 
            clinic={selectedClinic} 
            isAdmin={isAdmin} 
            onBack={() => navigate('catalog')} 
            onUpdate={updateClinicLocally}
          />
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="col-span-1 md:col-span-2">
            <span className="text-xl font-bold text-white uppercase tracking-tighter">REI DAS CLÍNICAS</span>
            <p className="mt-4 max-w-sm mx-auto md:mx-0">
              A maior autoridade em compra e venda de clínicas no Brasil. Segurança, transparência e as melhores negociações do mercado.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Links</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('home')}>Início</button></li>
              <li><button onClick={() => navigate('catalog')}>Ver Clínicas</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li>WhatsApp: {CONTACT_WHATSAPP_FORMATTED}</li>
              <li>São Paulo - SP</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          &copy; {new Date().getFullYear()} Rei das Clínicas. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default App;
